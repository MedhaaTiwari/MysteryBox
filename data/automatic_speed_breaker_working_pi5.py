#!/usr/bin/env python3
"""
Automatic Speed Breaker Prototype — Raspberry Pi 5
---------------------------------------------------
Two roadside HC-SR04 sensors measure a vehicle's travel time over a known gap.
If calculated speed exceeds SPEED_THRESHOLD_KMH, two servos raise the model
speed breaker, and the LED + buzzer alert. Otherwise, the breaker stays down.

BCM pins:
  Sensor A: TRIG=23, ECHO=24
  Sensor B: TRIG=5,  ECHO=6
  Servo 1: GPIO18
  Servo 2: GPIO27
  LED: GPIO20
  Buzzer: GPIO16

IMPORTANT HARDWARE SAFETY:
- HC-SR04 ECHO is normally 5 V. Raspberry Pi GPIO is 3.3 V tolerant.
  Do not connect ECHO directly to the Pi; use a level shifter or divider.
- Power servos from a suitable external 5 V supply and connect its GND to Pi GND.
- Test servos with the mechanism unloaded and keep hands clear.
- This is a toy/model prototype, not suitable for controlling a real road breaker.
"""

from gpiozero import DistanceSensor, Servo, LED, Buzzer, Device
from gpiozero.pins.lgpio import LGPIOFactory
from time import monotonic, sleep
from threading import Lock, Thread, Event

# Use the supported GPIO backend for Raspberry Pi 5.
Device.pin_factory = LGPIOFactory()

# ---------------- GPIO PIN MAPPING (BCM) ----------------
SENSOR_A_TRIG = 23
SENSOR_A_ECHO = 24
SENSOR_B_TRIG = 5
SENSOR_B_ECHO = 6

SERVO_1_PIN = 18
SERVO_2_PIN = 27
LED_PIN = 20
BUZZER_PIN = 16

# ---------------- CONFIGURATION ----------------
SENSOR_GAP_M = 0.30          # Measure the distance along the road between A and B
DETECT_DISTANCE_M = 0.20     # Sensor reports a vehicle inside this distance
SPEED_THRESHOLD_KMH = 20.0   # Breaker engages only when speed is ABOVE this value
SCALE = 1.0                  # Calibrated model-scale multiplier; default = no scaling
BREAKER_HOLD_SECONDS = 4.0
MAX_TRAVEL_TIME_S = 5.0      # Discard A events if B does not trigger in time
COOLDOWN_SECONDS = 1.5       # Ignore repeated detections immediately after a result

# gpiozero Servo values are normalized (-1 to +1), not degrees.
# Calibrate these values for the physical linkage.
SERVO_1_DOWN = -1.0
SERVO_1_UP = 0.6
# Since the servos face each other, one may need to rotate in the opposite direction.
SERVO_2_DOWN = 1.0
SERVO_2_UP = -0.6

# Sensor sampling can be noisy. DistanceSensor's callbacks fire when the measured
# distance crosses the configured threshold. Mount both sensors at the road edge,
# facing across the road toward the passing vehicle; space them along the road.
sensor_a = DistanceSensor(
    echo=SENSOR_A_ECHO,
    trigger=SENSOR_A_TRIG,
    max_distance=2.0,
    threshold_distance=DETECT_DISTANCE_M,
    queue_len=3,
    partial=True
)
sensor_b = DistanceSensor(
    echo=SENSOR_B_ECHO,
    trigger=SENSOR_B_TRIG,
    max_distance=2.0,
    threshold_distance=DETECT_DISTANCE_M,
    queue_len=3,
    partial=True
)

servo_1 = Servo(SERVO_1_PIN)
servo_2 = Servo(SERVO_2_PIN)
status_led = LED(LED_PIN)
buzzer = Buzzer(BUZZER_PIN)

state_lock = Lock()
actuation_lock = Lock()
shutdown_event = Event()

state = {
    "sensor_a_time": None,
    "last_result_time": 0.0,
    "a_armed": True,
    "b_armed": True,
    "breaker_active": False,
}


def breaker_down():
    """Move the model breaker to its down position and silence indicators."""
    servo_1.value = SERVO_1_DOWN
    servo_2.value = SERVO_2_DOWN
    status_led.off()
    buzzer.off()
    with state_lock:
        state["breaker_active"] = False
    print("[BREAKER] Speed breaker disengaged — DOWN position.")


def lower_after_delay():
    """Keep the breaker up for the configured interval, then lower it."""
    if shutdown_event.wait(BREAKER_HOLD_SECONDS):
        return
    with actuation_lock:
        if not shutdown_event.is_set():
            print("[BREAKER] Hold time complete. Lowering speed breaker...")
            breaker_down()


def engage_breaker():
    """Raise the breaker and activate LED/buzzer for a limited time."""
    with actuation_lock:
        if shutdown_event.is_set():
            return
        with state_lock:
            if state["breaker_active"]:
                print("[BREAKER] Already raised; keeping current activation.")
                return
            state["breaker_active"] = True

        print("[ALERT] Speed threshold exceeded!")
        print("[BREAKER] Speed breaker engaging...")
        servo_1.value = SERVO_1_UP
        servo_2.value = SERVO_2_UP
        status_led.on()
        buzzer.on()
        print(f"[BREAKER] Raised to calibrated model position for {BREAKER_HOLD_SECONDS:.1f} seconds.")
        Thread(target=lower_after_delay, daemon=True).start()


def process_speed(elapsed_s):
    if elapsed_s <= 0:
        print("[ERROR] Invalid elapsed time; speed measurement discarded.")
        return

    speed_mps = SENSOR_GAP_M / elapsed_s
    speed_kmh = speed_mps * 3.6 * SCALE

    print("\\n========== SPEED MEASUREMENT ==========")
    print(f"[INFO] Sensor A → Sensor B time: {elapsed_s:.4f} s")
    print(f"[INFO] Distance between sensors: {SENSOR_GAP_M:.3f} m")
    print(f"[RESULT] Calculated vehicle speed: {speed_kmh:.2f} km/h")
    print(f"[INFO] Activation threshold: > {SPEED_THRESHOLD_KMH:.2f} km/h")

    if speed_kmh > SPEED_THRESHOLD_KMH:
        print("[STATUS] OVERSPEED CONDITION DETECTED.")
        print("[ALERT] LED and buzzer activated.")
        engage_breaker()
    else:
        print("[STATUS] Speed is at or below threshold.")
        print("[BREAKER] Speed breaker remains DOWN.")
        # Do not unexpectedly lower a breaker that is already in its timed cycle.
        with state_lock:
            active = state["breaker_active"]
        if not active:
            status_led.off()
            buzzer.off()

    print("=======================================\\n")


def on_sensor_a_in_range():
    """Record the time the vehicle enters Sensor A's detection zone."""
    now = monotonic()
    with state_lock:
        if shutdown_event.is_set():
            return
        if now - state["last_result_time"] < COOLDOWN_SECONDS:
            return
        if not state["a_armed"]:
            return

        state["sensor_a_time"] = now
        state["a_armed"] = False
        print("[DETECTION] Vehicle detected at Sensor A (entry).")
        print("[TIMER] Timing started at Sensor A.")


def on_sensor_a_out_of_range():
    with state_lock:
        state["a_armed"] = True


def on_sensor_b_in_range():
    """Record Sensor B time and calculate speed from the A-to-B travel time."""
    now = monotonic()
    with state_lock:
        if shutdown_event.is_set():
            return
        if not state["b_armed"]:
            return

        state["b_armed"] = False
        start_time = state["sensor_a_time"]

        if start_time is None:
            print("[INFO] Sensor B detected a vehicle, but no valid Sensor A start was recorded; ignoring.")
            return

        elapsed = now - start_time
        state["sensor_a_time"] = None
        state["last_result_time"] = now

    if elapsed > MAX_TRAVEL_TIME_S:
        print(f"[WARNING] Sensor B trigger arrived after {elapsed:.2f} s; measurement timed out.")
        return

    print("[DETECTION] Vehicle detected at Sensor B (exit).")
    print("[TIMER] Timing stopped at Sensor B.")
    process_speed(elapsed)


def on_sensor_b_out_of_range():
    with state_lock:
        state["b_armed"] = True


sensor_a.when_in_range = on_sensor_a_in_range
sensor_a.when_out_of_range = on_sensor_a_out_of_range
sensor_b.when_in_range = on_sensor_b_in_range
sensor_b.when_out_of_range = on_sensor_b_out_of_range


def main():
    print("\\n==============================================")
    print(" AUTOMATIC SPEED BREAKER — RASPBERRY PI 5")
    print(" Two-sensor speed detection / model prototype")
    print("==============================================")
    print(f"[SETUP] Sensor gap: {SENSOR_GAP_M:.2f} m")
    print(f"[SETUP] Detection distance: {DETECT_DISTANCE_M * 100:.0f} cm")
    print(f"[SETUP] Threshold: speed > {SPEED_THRESHOLD_KMH:.1f} km/h")
    print("[SETUP] Camera disabled/not used in this version.")
    print("[SETUP] Waiting for a vehicle at Sensor A...")
    breaker_down()

    try:
        while True:
            # Report if Sensor A was triggered but Sensor B never followed.
            sleep(0.1)
            with state_lock:
                start_time = state["sensor_a_time"]
                a_armed = state["a_armed"]
            if start_time is not None and monotonic() - start_time > MAX_TRAVEL_TIME_S:
                with state_lock:
                    # Only clear the same stale measurement.
                    if state["sensor_a_time"] == start_time:
                        state["sensor_a_time"] = None
                print("[WARNING] No Sensor B detection before timeout. Resetting measurement.")

    except KeyboardInterrupt:
        print("\\n[SHUTDOWN] Stop requested by user.")

    finally:
        shutdown_event.set()
        breaker_down()
        for device in (sensor_a, sensor_b, servo_1, servo_2, status_led, buzzer):
            device.close()
        print("[SHUTDOWN] GPIO resources released. System stopped.")


if __name__ == "__main__":
    main()
