const CASES = [
  {
    "id": "case-01",
    "number": 1,
    "title": "The Last Guest",
    "difficulty": "Easy",
    "location": "The Vale Estate",
    "crime": "Murder",
    "victim": "art collector Adrian Vale",
    "briefing": "Art collector adrian vale is at the centre of a murder investigation at The Vale Estate. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "elena",
        "name": "Elena Vale",
        "role": "The Heir",
        "profile": "Adrian's niece, next in line for the collection.",
        "alibi": "I was in the gallery from 11:10 until the alarm."
      },
      {
        "id": "miles",
        "name": "Miles Rowan",
        "role": "The Archivist",
        "profile": "Keeper of the private archive.",
        "alibi": "I locked the archive and went downstairs."
      },
      {
        "id": "vivienne",
        "name": "Vivienne Cross",
        "role": "The Dealer",
        "profile": "A rival dealer whose contract was cancelled.",
        "alibi": "I stayed with the dinner guests."
      },
      {
        "id": "thomas",
        "name": "Thomas Reed",
        "role": "The Butler",
        "profile": "A long-serving employee with keys to every room.",
        "alibi": "I was in the west corridor."
      }
    ],
    "clues": [
      {
        "id": "case-01-clue-1",
        "title": "Stopped clock",
        "category": "Timeline",
        "description": "The study clock stopped at 11:20, but a service note records it running at 11:35.",
        "detail": "Only someone with access to the study could have altered the clock after 11:20."
      },
      {
        "id": "case-01-clue-2",
        "title": "Torn station receipt",
        "category": "Paper trail",
        "description": "A locker receipt bears the time 11:31, contradicting the claim that the east wing was empty.",
        "detail": "The time contradicts the culprit's alibi and places them near the service passage."
      },
      {
        "id": "case-01-clue-3",
        "title": "Blue archive ink",
        "category": "Trace evidence",
        "description": "Blue archival ink was found on the cuff of a jacket.",
        "detail": "The same ink was used to alter the clock's maintenance note; the culprit had access to the archive."
      },
      {
        "id": "case-01-clue-4",
        "title": "Gallery reflection",
        "category": "Witness detail",
        "description": "A framed mirror shows a figure leaving the gallery before the alarm.",
        "detail": "The reflection contradicts Elena's claim that she remained in the gallery."
      }
    ],
    "solution": {
      "suspectId": "elena",
      "motive": "Inheritance",
      "explanation": "The clock and receipt place the culprit in the study after their alibi says they had left. The archive ink links them to the altered record.",
      "requiredClues": [
        "case-01-clue-1",
        "case-01-clue-3",
        "case-01-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on blue archive ink and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is stopped clock, blue archive ink, and gallery reflection. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-02",
    "number": 2,
    "title": "The Vanishing Violin",
    "difficulty": "Easy",
    "location": "Bellweather Conservatory",
    "crime": "Theft",
    "victim": "the Stradivarius violin",
    "briefing": "The stradivarius violin is at the centre of a theft investigation at Bellweather Conservatory. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-02-suspect-1",
        "name": "Marco Bell",
        "role": "The Soloist",
        "profile": "A virtuoso facing debts and a cancelled tour.",
        "alibi": "I rehearsed alone until the final bell."
      },
      {
        "id": "case-02-suspect-2",
        "name": "Nina Cho",
        "role": "The Stage Manager",
        "profile": "Controls the stage schedule and access keys.",
        "alibi": "I was checking the balcony lights."
      },
      {
        "id": "case-02-suspect-3",
        "name": "Felix Hart",
        "role": "The Collector",
        "profile": "Had offered to buy the violin privately.",
        "alibi": "I never entered the backstage wing."
      },
      {
        "id": "case-02-suspect-4",
        "name": "Ada Finch",
        "role": "The Luthier",
        "profile": "Maintains the instruments and cases.",
        "alibi": "I was in the workshop."
      }
    ],
    "clues": [
      {
        "id": "case-02-clue-1",
        "title": "Rosin dust",
        "category": "Trace evidence",
        "description": "A fresh line of rosin dust leads from the display stand to the rehearsal case.",
        "detail": "The route is consistent with someone who handled the violin and knew the cases."
      },
      {
        "id": "case-02-clue-2",
        "title": "Humidity alert",
        "category": "System record",
        "description": "The display humidity alarm was manually triggered, not caused by a climate change.",
        "detail": "The alert was used to draw staff away from the display."
      },
      {
        "id": "case-02-clue-3",
        "title": "Rehearsal log",
        "category": "Timeline",
        "description": "The soloist's signed rehearsal log was completed before the time he claimed to be playing.",
        "detail": "The log disproves Marco's alibi."
      },
      {
        "id": "case-02-clue-4",
        "title": "Loose case latch",
        "category": "Physical evidence",
        "description": "A repaired case latch was opened from the inside with a narrow tuning tool.",
        "detail": "The tool is consistent with the soloist's tuning kit."
      }
    ],
    "solution": {
      "suspectId": "case-02-suspect-1",
      "motive": "Debt",
      "explanation": "The rosin trail and false humidity alert show the thief used the instrument case route, while the rehearsal log breaks the suspect's alibi.",
      "requiredClues": [
        "case-02-clue-1",
        "case-02-clue-3",
        "case-02-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on rehearsal log and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is rosin dust, rehearsal log, and loose case latch. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-03",
    "number": 3,
    "title": "A Bitter Vintage",
    "difficulty": "Easy",
    "location": "Blackthorn Vineyard",
    "crime": "Sabotage",
    "victim": "the reserve wine shipment",
    "briefing": "The reserve wine shipment is at the centre of a sabotage investigation at Blackthorn Vineyard. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-03-suspect-1",
        "name": "Celine March",
        "role": "The Winemaker",
        "profile": "Was publicly blamed for a failed vintage.",
        "alibi": "I stayed in the tasting room all evening."
      },
      {
        "id": "case-03-suspect-2",
        "name": "Owen Pike",
        "role": "The Cellar Master",
        "profile": "Maintains the locked reserve cellar.",
        "alibi": "I handed over my keys at six."
      },
      {
        "id": "case-03-suspect-3",
        "name": "Ruth Bell",
        "role": "The Investor",
        "profile": "Was about to sell her shares.",
        "alibi": "I was on a call in the courtyard."
      },
      {
        "id": "case-03-suspect-4",
        "name": "Peter Vale",
        "role": "The Sommelier",
        "profile": "Selected the bottles for the event.",
        "alibi": "I poured only from the service table."
      }
    ],
    "clues": [
      {
        "id": "case-03-clue-1",
        "title": "Altered tasting card",
        "category": "Paper trail",
        "description": "The card's ink is fresh over an older wine pairing.",
        "detail": "The card was changed to redirect attention to the wrong bottle."
      },
      {
        "id": "case-03-clue-2",
        "title": "Sugar trace",
        "category": "Lab note",
        "description": "A trace of sugar syrup was found beneath the reserve bottle seal.",
        "detail": "The bottle was tampered with after it left the cellar."
      },
      {
        "id": "case-03-clue-3",
        "title": "Cellar key audit",
        "category": "Access log",
        "description": "A duplicate cellar key was used at 7:42 PM.",
        "detail": "The culprit had access to the cellar despite claiming not to."
      },
      {
        "id": "case-03-clue-4",
        "title": "Unopened decanter",
        "category": "Physical evidence",
        "description": "The decanter at the table remained sealed while the reserve bottle had a broken wax edge.",
        "detail": "The tampered bottle was the source, not the decanter."
      }
    ],
    "solution": {
      "suspectId": "case-03-suspect-1",
      "motive": "Revenge",
      "explanation": "The altered tasting card, sugar trace, and cellar key audit establish that the sabotage required cellar access after the tasting began.",
      "requiredClues": [
        "case-03-clue-1",
        "case-03-clue-3",
        "case-03-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on cellar key audit and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is altered tasting card, cellar key audit, and unopened decanter. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-04",
    "number": 4,
    "title": "The Lighthouse Signal",
    "difficulty": "Easy",
    "location": "Greycap Lighthouse",
    "crime": "Missing person",
    "victim": "keeper Elias Ward",
    "briefing": "Keeper elias ward is at the centre of a missing person investigation at Greycap Lighthouse. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-04-suspect-1",
        "name": "Mara Voss",
        "role": "The Assistant Keeper",
        "profile": "Was due to replace Elias the next morning.",
        "alibi": "I stayed in the lamp room during the storm."
      },
      {
        "id": "case-04-suspect-2",
        "name": "Jon Bell",
        "role": "The Fisherman",
        "profile": "Saw a signal that should not have appeared.",
        "alibi": "I never came ashore that night."
      },
      {
        "id": "case-04-suspect-3",
        "name": "Dr. Saye",
        "role": "The Researcher",
        "profile": "Was studying unusual coastal lights.",
        "alibi": "I was writing notes in the guest room."
      },
      {
        "id": "case-04-suspect-4",
        "name": "Calder Finch",
        "role": "The Mechanic",
        "profile": "Maintains the lamp mechanism.",
        "alibi": "I was in the engine shed."
      }
    ],
    "clues": [
      {
        "id": "case-04-clue-1",
        "title": "Lens rotation log",
        "category": "Mechanical record",
        "description": "The lens paused for exactly four minutes during the storm.",
        "detail": "Someone manually interrupted the signal."
      },
      {
        "id": "case-04-clue-2",
        "title": "Wet boot prints",
        "category": "Trace evidence",
        "description": "Boot prints lead from the sea door to the maintenance stair.",
        "detail": "The route was used during the supposed blackout."
      },
      {
        "id": "case-04-clue-3",
        "title": "Spare wick",
        "category": "Physical evidence",
        "description": "A fresh wick was installed despite the keeper's report that no maintenance occurred.",
        "detail": "The lamp room was accessed after the log was signed."
      },
      {
        "id": "case-04-clue-4",
        "title": "Radio transcript",
        "category": "Communication",
        "description": "A radio call uses the old keeper's private code phrase.",
        "detail": "The caller knew the keeper's routine and intended to conceal a meeting."
      }
    ],
    "solution": {
      "suspectId": "case-04-suspect-1",
      "motive": "Cover-up",
      "explanation": "The lens rotation log and wet boot prints show someone used the maintenance stair during the claimed blackout.",
      "requiredClues": [
        "case-04-clue-1",
        "case-04-clue-3",
        "case-04-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on spare wick and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is lens rotation log, spare wick, and radio transcript. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-05",
    "number": 5,
    "title": "The Clockmaker's Alibi",
    "difficulty": "Moderate",
    "location": "Wren & Son Horology",
    "crime": "Fraud",
    "victim": "a set of antique watches",
    "briefing": "A set of antique watches is at the centre of a fraud investigation at Wren & Son Horology. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-05-suspect-1",
        "name": "Edwin Wren",
        "role": "The Clockmaker",
        "profile": "Could profit from replacing originals with replicas.",
        "alibi": "I was delivering a clock across town."
      },
      {
        "id": "case-05-suspect-2",
        "name": "Lydia Moss",
        "role": "The Appraiser",
        "profile": "Was hired to certify the collection.",
        "alibi": "I appraised each watch in the workshop."
      },
      {
        "id": "case-05-suspect-3",
        "name": "Noah Wren",
        "role": "The Apprentice",
        "profile": "Knows the shop's hidden drawers.",
        "alibi": "I was cleaning the front counter."
      },
      {
        "id": "case-05-suspect-4",
        "name": "Bea Clarke",
        "role": "The Buyer",
        "profile": "Had already paid a deposit.",
        "alibi": "I never touched the watches."
      }
    ],
    "clues": [
      {
        "id": "case-05-clue-1",
        "title": "Minute-hand scratch",
        "category": "Physical evidence",
        "description": "The scratch pattern matches the replica set, not the catalogue photographs.",
        "detail": "The watches were swapped before the appraisal."
      },
      {
        "id": "case-05-clue-2",
        "title": "Carbon-copy invoice",
        "category": "Paper trail",
        "description": "A carbon copy records a private sale earlier than the public invoice.",
        "detail": "Someone concealed an earlier transfer."
      },
      {
        "id": "case-05-clue-3",
        "title": "Workshop dust",
        "category": "Trace evidence",
        "description": "Fresh brass dust sits inside the locked replica drawer.",
        "detail": "The drawer was used recently by someone with workshop access."
      },
      {
        "id": "case-05-clue-4",
        "title": "Delivery ledger",
        "category": "Timeline",
        "description": "The delivery was logged after the claimed arrival time.",
        "detail": "Edwin's alibi puts the delivery in the wrong order."
      }
    ],
    "solution": {
      "suspectId": "case-05-suspect-1",
      "motive": "Greed",
      "explanation": "The minute hand scratches and invoice carbon copy show the clocks were switched before the appraisal, by the person who claimed to be away.",
      "requiredClues": [
        "case-05-clue-1",
        "case-05-clue-3",
        "case-05-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on workshop dust and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is minute-hand scratch, workshop dust, and delivery ledger. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-06",
    "number": 6,
    "title": "The Orchid Room",
    "difficulty": "Moderate",
    "location": "Ashcombe Hotel",
    "crime": "Poisoning",
    "victim": "hotel owner Celia Ashcombe",
    "briefing": "Hotel owner celia ashcombe is at the centre of a poisoning investigation at Ashcombe Hotel. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-06-suspect-1",
        "name": "Pavel Soren",
        "role": "The Head Gardener",
        "profile": "Was dismissed after a dispute over the conservatory.",
        "alibi": "I was pruning in the east greenhouse."
      },
      {
        "id": "case-06-suspect-2",
        "name": "Mina Ashcombe",
        "role": "The Daughter",
        "profile": "Feared losing the family hotel.",
        "alibi": "I was greeting guests in the lobby."
      },
      {
        "id": "case-06-suspect-3",
        "name": "Chef Laurent",
        "role": "The Chef",
        "profile": "Had argued with Celia about the menu.",
        "alibi": "I never left the kitchen."
      },
      {
        "id": "case-06-suspect-4",
        "name": "Rex Doyle",
        "role": "The Concierge",
        "profile": "Knows every guest's movements.",
        "alibi": "I was answering the switchboard."
      }
    ],
    "clues": [
      {
        "id": "case-06-clue-1",
        "title": "Orchid watering chart",
        "category": "Schedule",
        "description": "A watering entry was added in a different pen at 9:15 PM.",
        "detail": "The entry disguises a visit to the orchid room."
      },
      {
        "id": "case-06-clue-2",
        "title": "Glass-rim residue",
        "category": "Forensic note",
        "description": "A trace on one glass is inconsistent with the drink served to the table.",
        "detail": "One glass was prepared separately."
      },
      {
        "id": "case-06-clue-3",
        "title": "Lobby bell record",
        "category": "Timeline",
        "description": "The bell was rung while the concierge was logged as away from the desk.",
        "detail": "The recorded movements do not match the claimed alibi."
      },
      {
        "id": "case-06-clue-4",
        "title": "Broken thorn",
        "category": "Trace evidence",
        "description": "A fresh orchid thorn was caught in a coat lining.",
        "detail": "The wearer passed through the greenhouse after pruning ended."
      }
    ],
    "solution": {
      "suspectId": "case-06-suspect-1",
      "motive": "Jealousy",
      "explanation": "The watering schedule and glass-rim residue link the culprit to the orchid room during the brief window when the drink was unattended.",
      "requiredClues": [
        "case-06-clue-1",
        "case-06-clue-3",
        "case-06-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on lobby bell record and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is orchid watering chart, lobby bell record, and broken thorn. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-07",
    "number": 7,
    "title": "The Silent Auction",
    "difficulty": "Moderate",
    "location": "Marrow House",
    "crime": "Forgery",
    "victim": "a signed first-edition manuscript",
    "briefing": "A signed first-edition manuscript is at the centre of a forgery investigation at Marrow House. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-07-suspect-1",
        "name": "Silas Grey",
        "role": "The Auctioneer",
        "profile": "Earns a commission on high-value sales.",
        "alibi": "I sealed the lot before guests arrived."
      },
      {
        "id": "case-07-suspect-2",
        "name": "June Mercer",
        "role": "The Scholar",
        "profile": "Could authenticate the author's handwriting.",
        "alibi": "I was in the reading room."
      },
      {
        "id": "case-07-suspect-3",
        "name": "Theo Banks",
        "role": "The Bidder",
        "profile": "Lost the auction to a rival.",
        "alibi": "I never went near the display."
      },
      {
        "id": "case-07-suspect-4",
        "name": "Ivy Shaw",
        "role": "The Registrar",
        "profile": "Maintains the lot catalogue.",
        "alibi": "I checked the guest list at the desk."
      }
    ],
    "clues": [
      {
        "id": "case-07-clue-1",
        "title": "Watermark mismatch",
        "category": "Document analysis",
        "description": "The displayed manuscript uses modern paper rather than the period watermark.",
        "detail": "The original was replaced before the lot opened."
      },
      {
        "id": "case-07-clue-2",
        "title": "Paddle record",
        "category": "Auction log",
        "description": "A paddle was registered under a guest who had already departed.",
        "detail": "Someone altered the attendance record."
      },
      {
        "id": "case-07-clue-3",
        "title": "Ink aging test",
        "category": "Lab note",
        "description": "The signature ink has not oxidized as long as the manuscript claims.",
        "detail": "The signature is a recent imitation."
      },
      {
        "id": "case-07-clue-4",
        "title": "Catalogue thread",
        "category": "Physical evidence",
        "description": "A fresh thread binds the replacement page into the original folder.",
        "detail": "The replacement was made by someone with catalogue access."
      }
    ],
    "solution": {
      "suspectId": "case-07-suspect-1",
      "motive": "Profit",
      "explanation": "The paper watermark, auction paddle record, and ink aging test show the manuscript was replaced by the person who handled the catalogue alone.",
      "requiredClues": [
        "case-07-clue-1",
        "case-07-clue-3",
        "case-07-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on ink aging test and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is watermark mismatch, ink aging test, and catalogue thread. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-08",
    "number": 8,
    "title": "Murder at Platform Nine",
    "difficulty": "Moderate",
    "location": "Northbridge Station",
    "crime": "Murder",
    "victim": "rail executive Victor Hale",
    "briefing": "Rail executive victor hale is at the centre of a murder investigation at Northbridge Station. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-08-suspect-1",
        "name": "Rhea Cole",
        "role": "The Signal Operator",
        "profile": "Controls platform signals and departure boards.",
        "alibi": "I followed the printed timetable exactly."
      },
      {
        "id": "case-08-suspect-2",
        "name": "Bram Holt",
        "role": "The Porter",
        "profile": "Moved luggage along the platform.",
        "alibi": "I was in the baggage hall."
      },
      {
        "id": "case-08-suspect-3",
        "name": "Nico Vale",
        "role": "The Passenger",
        "profile": "Had a public argument with Victor.",
        "alibi": "I boarded before the final whistle."
      },
      {
        "id": "case-08-suspect-4",
        "name": "Etta Moss",
        "role": "The Inspector",
        "profile": "Checks tickets and platform access.",
        "alibi": "I was inspecting the waiting room."
      }
    ],
    "clues": [
      {
        "id": "case-08-clue-1",
        "title": "Platform clock",
        "category": "Timeline",
        "description": "The platform clock runs four minutes slow compared with the station master clock.",
        "detail": "The public timetable cannot be taken at face value."
      },
      {
        "id": "case-08-clue-2",
        "title": "Ticket punch",
        "category": "Physical evidence",
        "description": "A ticket was punched after the train's recorded departure.",
        "detail": "Someone had access to the platform after the official close."
      },
      {
        "id": "case-08-clue-3",
        "title": "Signalman's notebook",
        "category": "Record",
        "description": "A signal change is written in a different hand from the rest of the log.",
        "detail": "The signal record was altered by someone familiar with the system."
      },
      {
        "id": "case-08-clue-4",
        "title": "Wet chalk mark",
        "category": "Trace evidence",
        "description": "A chalk mark appears beneath the signal lever, matching the operator's maintenance kit.",
        "detail": "The lever was handled during the disputed interval."
      }
    ],
    "solution": {
      "suspectId": "case-08-suspect-1",
      "motive": "Blackmail",
      "explanation": "The platform clock, ticket punch, and signalman's notebook reveal a gap in the official departure timeline that only one suspect could exploit.",
      "requiredClues": [
        "case-08-clue-1",
        "case-08-clue-3",
        "case-08-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on signalman's notebook and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is platform clock, signalman's notebook, and wet chalk mark. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-09",
    "number": 9,
    "title": "The Glasshouse Fire",
    "difficulty": "Hard",
    "location": "Larkspur Botanical Gardens",
    "crime": "Arson",
    "victim": "the rare moon orchid collection",
    "briefing": "The rare moon orchid collection is at the centre of a arson investigation at Larkspur Botanical Gardens. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-09-suspect-1",
        "name": "Tamsin Reed",
        "role": "The Botanist",
        "profile": "Lost a grant after the collection was transferred.",
        "alibi": "I was cataloguing seeds in the lab."
      },
      {
        "id": "case-09-suspect-2",
        "name": "Dr. Arun",
        "role": "The Director",
        "profile": "Was under pressure to sell the collection.",
        "alibi": "I was at the donors' dinner."
      },
      {
        "id": "case-09-suspect-3",
        "name": "Milo Park",
        "role": "The Electrician",
        "profile": "Serviced the greenhouse wiring.",
        "alibi": "I left before closing."
      },
      {
        "id": "case-09-suspect-4",
        "name": "Esme Vale",
        "role": "The Volunteer",
        "profile": "Was seen arguing near the glasshouse.",
        "alibi": "I was outside taking photographs."
      }
    ],
    "clues": [
      {
        "id": "case-09-clue-1",
        "title": "Sprinkler valve",
        "category": "Mechanical evidence",
        "description": "The valve was turned off manually before the fire began.",
        "detail": "The fire was designed to spread without automatic suppression."
      },
      {
        "id": "case-09-clue-2",
        "title": "Ash pattern",
        "category": "Scene analysis",
        "description": "The burn pattern starts behind the specimen cabinet, not at the doorway.",
        "detail": "The apparent entry point is misleading."
      },
      {
        "id": "case-09-clue-3",
        "title": "Clipped alarm wire",
        "category": "Physical evidence",
        "description": "A sensor wire was cut with a narrow insulated tool.",
        "detail": "The alarm was disabled deliberately."
      },
      {
        "id": "case-09-clue-4",
        "title": "Seed catalogue",
        "category": "Paper trail",
        "description": "A page listing the rare orchid was removed before the fire report.",
        "detail": "Someone knew exactly which specimens would be destroyed."
      }
    ],
    "solution": {
      "suspectId": "case-09-suspect-1",
      "motive": "Revenge",
      "explanation": "The sprinkler valve, ash pattern, and clipped wire show the fire was started in the only section isolated from the alarm.",
      "requiredClues": [
        "case-09-clue-1",
        "case-09-clue-3",
        "case-09-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on clipped alarm wire and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is sprinkler valve, clipped alarm wire, and seed catalogue. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-10",
    "number": 10,
    "title": "The Midnight Broadcast",
    "difficulty": "Hard",
    "location": "WQRT Radio Studio",
    "crime": "Sabotage",
    "victim": "the station's emergency broadcast",
    "briefing": "The station's emergency broadcast is at the centre of a sabotage investigation at WQRT Radio Studio. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-10-suspect-1",
        "name": "Dorian Pike",
        "role": "The Producer",
        "profile": "Was about to be fired over a ratings scandal.",
        "alibi": "I was in the sound booth all night."
      },
      {
        "id": "case-10-suspect-2",
        "name": "Maya Lin",
        "role": "The Host",
        "profile": "Delivered the live programme.",
        "alibi": "I never left the microphone."
      },
      {
        "id": "case-10-suspect-3",
        "name": "Gus Bell",
        "role": "The Technician",
        "profile": "Maintains the tape machines.",
        "alibi": "I was in the transmitter room."
      },
      {
        "id": "case-10-suspect-4",
        "name": "Nell Frost",
        "role": "The Intern",
        "profile": "Was asked to fetch a reel.",
        "alibi": "I delivered the reel and went home."
      }
    ],
    "clues": [
      {
        "id": "case-10-clue-1",
        "title": "Reel splice",
        "category": "Audio evidence",
        "description": "The broadcast tape contains a physical splice hidden beneath a cue tone.",
        "detail": "The emergency segment was inserted after recording."
      },
      {
        "id": "case-10-clue-2",
        "title": "Key log",
        "category": "Access record",
        "description": "The control-room key was signed back in before the broadcast ended.",
        "detail": "Someone used the room after claiming to leave."
      },
      {
        "id": "case-10-clue-3",
        "title": "Cue sheet",
        "category": "Paper trail",
        "description": "The printed cue sheet has a timing correction in a different typeface.",
        "detail": "The official rundown was altered."
      },
      {
        "id": "case-10-clue-4",
        "title": "Warm deck",
        "category": "Physical evidence",
        "description": "One tape deck remained warm despite the technician's claim it was unused.",
        "detail": "The machine was operated during the disputed interval."
      }
    ],
    "solution": {
      "suspectId": "case-10-suspect-1",
      "motive": "Reputation",
      "explanation": "The reel splice and control-room key log reveal that the broadcast was replaced during a short unattended interval.",
      "requiredClues": [
        "case-10-clue-1",
        "case-10-clue-3",
        "case-10-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on cue sheet and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is reel splice, cue sheet, and warm deck. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-11",
    "number": 11,
    "title": "The Snowbound Lodge",
    "difficulty": "Hard",
    "location": "Frostpine Lodge",
    "crime": "Theft",
    "victim": "a sealed charity donation box",
    "briefing": "A sealed charity donation box is at the centre of a theft investigation at Frostpine Lodge. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-11-suspect-1",
        "name": "Greta Vale",
        "role": "The Lodge Manager",
        "profile": "Was behind on the lodge's bills.",
        "alibi": "I was clearing snow from the entrance."
      },
      {
        "id": "case-11-suspect-2",
        "name": "Omar Finch",
        "role": "The Chef",
        "profile": "Handled the dinner service.",
        "alibi": "I stayed in the kitchen."
      },
      {
        "id": "case-11-suspect-3",
        "name": "Pia North",
        "role": "The Guest",
        "profile": "Was travelling under an assumed name.",
        "alibi": "I was reading by the fire."
      },
      {
        "id": "case-11-suspect-4",
        "name": "Hugh Bell",
        "role": "The Guide",
        "profile": "Knew the lodge's back paths.",
        "alibi": "I was checking the trail markers."
      }
    ],
    "clues": [
      {
        "id": "case-11-clue-1",
        "title": "Melted snow",
        "category": "Trace evidence",
        "description": "A wet boot print formed before the blizzard reached its peak.",
        "detail": "The person entered earlier than claimed."
      },
      {
        "id": "case-11-clue-2",
        "title": "Fireplace ash",
        "category": "Scene evidence",
        "description": "A torn donation label was burned in the lodge fireplace.",
        "detail": "The box label was deliberately destroyed."
      },
      {
        "id": "case-11-clue-3",
        "title": "Meal chit",
        "category": "Timeline",
        "description": "A meal chit was stamped while the manager was supposedly outside.",
        "detail": "The alibi conflicts with the service record."
      },
      {
        "id": "case-11-clue-4",
        "title": "Back-path map",
        "category": "Location record",
        "description": "A path marked closed was recently annotated in the manager's hand.",
        "detail": "The route was used despite the lodge's warning."
      }
    ],
    "solution": {
      "suspectId": "case-11-suspect-1",
      "motive": "Desperation",
      "explanation": "The melted snow, fireplace ash, and meal chit place the thief indoors during the only time their alibi says they were outside.",
      "requiredClues": [
        "case-11-clue-1",
        "case-11-clue-3",
        "case-11-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on meal chit and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is melted snow, meal chit, and back-path map. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-12",
    "number": 12,
    "title": "The Museum After Dark",
    "difficulty": "Hard",
    "location": "Aurelian Museum",
    "crime": "Theft",
    "victim": "the sapphire astrolabe",
    "briefing": "The sapphire astrolabe is at the centre of a theft investigation at Aurelian Museum. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-12-suspect-1",
        "name": "Felix Ward",
        "role": "The Curator",
        "profile": "Controlled the display and inventory records.",
        "alibi": "I sealed the gallery at nine."
      },
      {
        "id": "case-12-suspect-2",
        "name": "Sana Mir",
        "role": "The Conservator",
        "profile": "Restored the display case.",
        "alibi": "I was in the preservation lab."
      },
      {
        "id": "case-12-suspect-3",
        "name": "Leo Grant",
        "role": "The Guard",
        "profile": "Patrolled the east wing.",
        "alibi": "I never crossed the gallery threshold."
      },
      {
        "id": "case-12-suspect-4",
        "name": "Ada North",
        "role": "The Donor",
        "profile": "Had requested the astrolabe be moved.",
        "alibi": "I left before the doors closed."
      }
    ],
    "clues": [
      {
        "id": "case-12-clue-1",
        "title": "Laser grid report",
        "category": "Security log",
        "description": "The grid registered a continuous beam, but the display sensor detected a weight change.",
        "detail": "The case was not opened in the usual way."
      },
      {
        "id": "case-12-clue-2",
        "title": "Replica pedestal",
        "category": "Physical evidence",
        "description": "A concealed hollow pedestal is lighter than the original display base.",
        "detail": "A decoy was used during the swap."
      },
      {
        "id": "case-12-clue-3",
        "title": "Inventory weight",
        "category": "Measurement",
        "description": "The recorded weight differs from the curator's signed inventory.",
        "detail": "The replacement occurred after the inventory was certified."
      },
      {
        "id": "case-12-clue-4",
        "title": "Glove fibre",
        "category": "Trace evidence",
        "description": "A fibre from a curator's white handling glove was caught beneath the base.",
        "detail": "The person who handled the display had privileged access."
      }
    ],
    "solution": {
      "suspectId": "case-12-suspect-1",
      "motive": "Greed",
      "explanation": "The laser grid was bypassed with a replica pedestal, and the inventory weight confirms the curator's replacement story is false.",
      "requiredClues": [
        "case-12-clue-1",
        "case-12-clue-3",
        "case-12-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on inventory weight and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is laser grid report, inventory weight, and glove fibre. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-13",
    "number": 13,
    "title": "The Composer's Final Note",
    "difficulty": "Hard",
    "location": "Ravenshade Theatre",
    "crime": "Murder",
    "victim": "composer Lucien March",
    "briefing": "Composer lucien march is at the centre of a murder investigation at Ravenshade Theatre. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-13-suspect-1",
        "name": "Mira Sol",
        "role": "The Conductor",
        "profile": "Was removed from the composer's final performance.",
        "alibi": "I never entered his dressing room."
      },
      {
        "id": "case-13-suspect-2",
        "name": "Elias Venn",
        "role": "The Pianist",
        "profile": "Was owed payment for months.",
        "alibi": "I practised the published score."
      },
      {
        "id": "case-13-suspect-3",
        "name": "Ruth March",
        "role": "The Widow",
        "profile": "Was excluded from the composer's will.",
        "alibi": "I was in the front row."
      },
      {
        "id": "case-13-suspect-4",
        "name": "Cal Rowan",
        "role": "The Stagehand",
        "profile": "Moved props and instruments.",
        "alibi": "I was striking the set."
      }
    ],
    "clues": [
      {
        "id": "case-13-clue-1",
        "title": "Rehearsal annotation",
        "category": "Score evidence",
        "description": "A final bar was rewritten after the orchestra's rehearsal copy was distributed.",
        "detail": "Someone altered the music after the rehearsal."
      },
      {
        "id": "case-13-clue-2",
        "title": "Metronome setting",
        "category": "Mechanical evidence",
        "description": "The dressing-room metronome was set to the tempo of the revised passage.",
        "detail": "The revised passage was rehearsed privately."
      },
      {
        "id": "case-13-clue-3",
        "title": "Ink blot",
        "category": "Trace evidence",
        "description": "Fresh ink on the score matches the conductor's fountain pen.",
        "detail": "The score was handled by someone with access to the conductor's desk."
      },
      {
        "id": "case-13-clue-4",
        "title": "Curtain call sheet",
        "category": "Timeline",
        "description": "A handwritten curtain-call change places one suspect backstage during the claimed performance.",
        "detail": "The official schedule hides a brief absence."
      }
    ],
    "solution": {
      "suspectId": "case-13-suspect-1",
      "motive": "Legacy",
      "explanation": "The rehearsal annotation, metronome setting, and ink blot reveal the final note was changed by the person who had the score alone.",
      "requiredClues": [
        "case-13-clue-1",
        "case-13-clue-3",
        "case-13-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on ink blot and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is rehearsal annotation, ink blot, and curtain call sheet. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-14",
    "number": 14,
    "title": "The Emerald Ledger",
    "difficulty": "Expert",
    "location": "Crown & Finch Bank",
    "crime": "Fraud",
    "victim": "a missing account ledger",
    "briefing": "A missing account ledger is at the centre of a fraud investigation at Crown & Finch Bank. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-14-suspect-1",
        "name": "Nora Finch",
        "role": "The Auditor",
        "profile": "Discovered discrepancies in the bank's books.",
        "alibi": "I filed the report and went home."
      },
      {
        "id": "case-14-suspect-2",
        "name": "Gideon Cross",
        "role": "The Branch Manager",
        "profile": "Could authorize vault access.",
        "alibi": "I was in the board meeting."
      },
      {
        "id": "case-14-suspect-3",
        "name": "Tess Ward",
        "role": "The Teller",
        "profile": "Handled customer deposits.",
        "alibi": "I closed my window at five."
      },
      {
        "id": "case-14-suspect-4",
        "name": "Malik Reed",
        "role": "The Courier",
        "profile": "Moved sealed records between branches.",
        "alibi": "I delivered only the envelopes on my manifest."
      }
    ],
    "clues": [
      {
        "id": "case-14-clue-1",
        "title": "Carbon ledger",
        "category": "Paper trail",
        "description": "A carbon copy retains transactions missing from the official ledger.",
        "detail": "The records were removed after the duplicate was made."
      },
      {
        "id": "case-14-clue-2",
        "title": "Vault humidity card",
        "category": "Environmental record",
        "description": "The vault door was open long enough to change the humidity reading.",
        "detail": "The ledger was removed during a short access window."
      },
      {
        "id": "case-14-clue-3",
        "title": "Inspection badge",
        "category": "Access record",
        "description": "A badge was used under a name absent from the inspection roster.",
        "detail": "The access list was manipulated."
      },
      {
        "id": "case-14-clue-4",
        "title": "Envelope seal",
        "category": "Physical evidence",
        "description": "A bank seal was reheated and pressed back into place.",
        "detail": "A document packet was opened and resealed."
      }
    ],
    "solution": {
      "suspectId": "case-14-suspect-1",
      "motive": "Cover-up",
      "explanation": "The carbon ledger and vault humidity card show the ledger was removed during a scheduled inspection, not overnight as claimed.",
      "requiredClues": [
        "case-14-clue-1",
        "case-14-clue-3",
        "case-14-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on inspection badge and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is carbon ledger, inspection badge, and envelope seal. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-15",
    "number": 15,
    "title": "The Red Room Cipher",
    "difficulty": "Expert",
    "location": "Harrow Club",
    "crime": "Blackmail",
    "victim": "a sealed diplomatic letter",
    "briefing": "A sealed diplomatic letter is at the centre of a blackmail investigation at Harrow Club. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-15-suspect-1",
        "name": "Beatrice Shaw",
        "role": "The Club Secretary",
        "profile": "Maintained private correspondence.",
        "alibi": "I locked the red room after dinner."
      },
      {
        "id": "case-15-suspect-2",
        "name": "Arthur Bell",
        "role": "The Chess Master",
        "profile": "Used coded games to pass messages.",
        "alibi": "I played in the main hall."
      },
      {
        "id": "case-15-suspect-3",
        "name": "Dina Cross",
        "role": "The Diplomat",
        "profile": "Was due to leave the country.",
        "alibi": "I never saw the letter."
      },
      {
        "id": "case-15-suspect-4",
        "name": "Victor Hale",
        "role": "The Treasurer",
        "profile": "Controlled the club's safe.",
        "alibi": "I counted the receipts in my office."
      }
    ],
    "clues": [
      {
        "id": "case-15-clue-1",
        "title": "Cipher key",
        "category": "Code analysis",
        "description": "The cipher uses an obsolete substitution key kept in the secretary's desk.",
        "detail": "The sender knew where the private key was stored."
      },
      {
        "id": "case-15-clue-2",
        "title": "Wax seal",
        "category": "Physical evidence",
        "description": "The seal was softened and reset without breaking the crest.",
        "detail": "The letter was opened and resealed."
      },
      {
        "id": "case-15-clue-3",
        "title": "Chess notation",
        "category": "Written clue",
        "description": "A move sequence matches the letter's encoded location, not a normal game strategy.",
        "detail": "The chess game carried a secondary message."
      },
      {
        "id": "case-15-clue-4",
        "title": "Room register",
        "category": "Access record",
        "description": "The red room was entered after it had been recorded as locked.",
        "detail": "The register was signed before the final visit."
      }
    ],
    "solution": {
      "suspectId": "case-15-suspect-1",
      "motive": "Blackmail",
      "explanation": "The cipher key, wax seal, and chess notation point to the person who had both the letter and the club's private codebook.",
      "requiredClues": [
        "case-15-clue-1",
        "case-15-clue-3",
        "case-15-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on chess notation and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is cipher key, chess notation, and room register. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-16",
    "number": 16,
    "title": "The Silver Screen Switch",
    "difficulty": "Expert",
    "location": "Orpheum Cinema",
    "crime": "Forgery",
    "victim": "the original film reel",
    "briefing": "The original film reel is at the centre of a forgery investigation at Orpheum Cinema. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-16-suspect-1",
        "name": "Otis Lane",
        "role": "The Projectionist",
        "profile": "Had sole access to the booth.",
        "alibi": "I ran the scheduled reel without interruption."
      },
      {
        "id": "case-16-suspect-2",
        "name": "Mabel Ross",
        "role": "The Actress",
        "profile": "Wanted the original footage destroyed.",
        "alibi": "I watched from the balcony."
      },
      {
        "id": "case-16-suspect-3",
        "name": "Jun Park",
        "role": "The Archivist",
        "profile": "Catalogued the film collection.",
        "alibi": "I was in the archive room."
      },
      {
        "id": "case-16-suspect-4",
        "name": "Eddie Vale",
        "role": "The Promoter",
        "profile": "Had sold tickets to a special screening.",
        "alibi": "I greeted patrons in the lobby."
      }
    ],
    "clues": [
      {
        "id": "case-16-clue-1",
        "title": "Splice marks",
        "category": "Film evidence",
        "description": "The reel contains two fresh splices with matching frame loss.",
        "detail": "A section was removed and another inserted."
      },
      {
        "id": "case-16-clue-2",
        "title": "Cue book",
        "category": "Projection record",
        "description": "A blackout cue was added in pencil after the book was signed.",
        "detail": "The reel switch was hidden during a planned dark interval."
      },
      {
        "id": "case-16-clue-3",
        "title": "Booth key",
        "category": "Access record",
        "description": "The booth key was checked out twice under one signature.",
        "detail": "The access log was falsified."
      },
      {
        "id": "case-16-clue-4",
        "title": "Dust pattern",
        "category": "Physical evidence",
        "description": "A clean rectangle on the shelf shows where a second reel was stored.",
        "detail": "A replacement reel was kept in the booth."
      }
    ],
    "solution": {
      "suspectId": "case-16-suspect-1",
      "motive": "Profit",
      "explanation": "The splice marks and projectionist's cue book establish that the reel was switched in the booth during a blackout cue.",
      "requiredClues": [
        "case-16-clue-1",
        "case-16-clue-3",
        "case-16-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on booth key and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is splice marks, booth key, and dust pattern. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-17",
    "number": 17,
    "title": "The Hollow Crown",
    "difficulty": "Expert",
    "location": "Eldergate Palace",
    "crime": "Theft",
    "victim": "the ceremonial crown jewel",
    "briefing": "The ceremonial crown jewel is at the centre of a theft investigation at Eldergate Palace. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-17-suspect-1",
        "name": "Prince Alaric",
        "role": "The Heir",
        "profile": "Was desperate to prove his claim.",
        "alibi": "I stayed on the dais during the ceremony."
      },
      {
        "id": "case-17-suspect-2",
        "name": "Lady Merrow",
        "role": "The Keeper",
        "profile": "Held the ceremonial keys.",
        "alibi": "I handed the crown to the guard."
      },
      {
        "id": "case-17-suspect-3",
        "name": "Captain Voss",
        "role": "The Guard Captain",
        "profile": "Directed the palace watch.",
        "alibi": "I never left the west gallery."
      },
      {
        "id": "case-17-suspect-4",
        "name": "Sera Vale",
        "role": "The Jeweller",
        "profile": "Serviced the crown settings.",
        "alibi": "I returned my tools before the event."
      }
    ],
    "clues": [
      {
        "id": "case-17-clue-1",
        "title": "Display felt",
        "category": "Trace evidence",
        "description": "A fresh impression in the velvet shows a small object was lifted and replaced.",
        "detail": "The jewel was removed without moving the crown."
      },
      {
        "id": "case-17-clue-2",
        "title": "Guard rotation",
        "category": "Timeline",
        "description": "Two guards exchanged posts earlier than the official schedule.",
        "detail": "The handoff created a short unobserved interval."
      },
      {
        "id": "case-17-clue-3",
        "title": "Jewel inventory",
        "category": "Record",
        "description": "The signed inventory describes the setting but not the stone's weight.",
        "detail": "The inventory was deliberately vague."
      },
      {
        "id": "case-17-clue-4",
        "title": "Ceremonial glove",
        "category": "Trace evidence",
        "description": "A dark fibre is caught in the glove used during the handoff.",
        "detail": "The handoff participant had contact with the setting."
      }
    ],
    "solution": {
      "suspectId": "case-17-suspect-1",
      "motive": "Power",
      "explanation": "The display felt, guard rotation, and jewel inventory establish that the jewel was removed during a rehearsed ceremonial handoff.",
      "requiredClues": [
        "case-17-clue-1",
        "case-17-clue-3",
        "case-17-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on jewel inventory and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is display felt, jewel inventory, and ceremonial glove. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-18",
    "number": 18,
    "title": "The Deepwater Manifest",
    "difficulty": "Master Detective",
    "location": "Port Meridian",
    "crime": "Smuggling",
    "victim": "a missing cargo container",
    "briefing": "A missing cargo container is at the centre of a smuggling investigation at Port Meridian. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-18-suspect-1",
        "name": "Captain Ivo",
        "role": "The Harbour Master",
        "profile": "Controlled berth assignments.",
        "alibi": "I was in the harbour office all night."
      },
      {
        "id": "case-18-suspect-2",
        "name": "Mara Quinn",
        "role": "The Crane Operator",
        "profile": "Operated the night cargo crane.",
        "alibi": "I moved only containers on the board."
      },
      {
        "id": "case-18-suspect-3",
        "name": "Seth Vale",
        "role": "The Broker",
        "profile": "Arranged the shipment.",
        "alibi": "I left before the tide turned."
      },
      {
        "id": "case-18-suspect-4",
        "name": "Anika Frost",
        "role": "The Customs Officer",
        "profile": "Checked cargo declarations.",
        "alibi": "I inspected the north gate."
      }
    ],
    "clues": [
      {
        "id": "case-18-clue-1",
        "title": "Duplicate stamp",
        "category": "Paper trail",
        "description": "The manifest bears a stamp from a seal retired months earlier.",
        "detail": "The shipping record was copied from an old template."
      },
      {
        "id": "case-18-clue-2",
        "title": "Tide note",
        "category": "Navigation record",
        "description": "The note records a tide window that does not match the declared movement.",
        "detail": "The container moved at a different time."
      },
      {
        "id": "case-18-clue-3",
        "title": "Crane log",
        "category": "Mechanical record",
        "description": "A manual override lifted a container absent from the movement board.",
        "detail": "Someone bypassed the official cargo list."
      },
      {
        "id": "case-18-clue-4",
        "title": "False weight",
        "category": "Measurement",
        "description": "The signed container weight matches an empty container, not the declared cargo.",
        "detail": "The person signing the manifest knew the cargo record was false."
      }
    ],
    "solution": {
      "suspectId": "case-18-suspect-1",
      "motive": "Profit",
      "explanation": "The manifest's duplicate stamp, tide note, and crane record show the container was moved on the night shift by the person who signed the false weight.",
      "requiredClues": [
        "case-18-clue-1",
        "case-18-clue-3",
        "case-18-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on crane log and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is duplicate stamp, crane log, and false weight. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-19",
    "number": 19,
    "title": "The Observatory Paradox",
    "difficulty": "Master Detective",
    "location": "Mount Aster Observatory",
    "crime": "Sabotage",
    "victim": "the observatory's eclipse recording",
    "briefing": "The observatory's eclipse recording is at the centre of a sabotage investigation at Mount Aster Observatory. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-19-suspect-1",
        "name": "Dr. Vale",
        "role": "The Lead Astronomer",
        "profile": "Had published a disputed prediction.",
        "alibi": "I was calibrating the secondary telescope."
      },
      {
        "id": "case-19-suspect-2",
        "name": "Kira Moss",
        "role": "The Data Analyst",
        "profile": "Processed the sensor readings.",
        "alibi": "I worked from the control room."
      },
      {
        "id": "case-19-suspect-3",
        "name": "Jonas Reed",
        "role": "The Technician",
        "profile": "Maintained the dome shutter.",
        "alibi": "I powered down the motor at midnight."
      },
      {
        "id": "case-19-suspect-4",
        "name": "Professor Sato",
        "role": "The Visiting Scholar",
        "profile": "Had challenged the lead's findings.",
        "alibi": "I observed from the west platform."
      }
    ],
    "clues": [
      {
        "id": "case-19-clue-1",
        "title": "Shutter telemetry",
        "category": "System log",
        "description": "The shutter reports a closed state while the lens received light.",
        "detail": "The telemetry was overridden or disconnected."
      },
      {
        "id": "case-19-clue-2",
        "title": "Lens dust",
        "category": "Physical evidence",
        "description": "Dust was disturbed only on the calibration lens, not the primary lens.",
        "detail": "The calibration assembly was touched during the critical window."
      },
      {
        "id": "case-19-clue-3",
        "title": "Star chart correction",
        "category": "Document evidence",
        "description": "A star position was corrected in pencil after the recording was archived.",
        "detail": "The official record was altered after capture."
      },
      {
        "id": "case-19-clue-4",
        "title": "Calibration key",
        "category": "Access record",
        "description": "The calibration key remained checked out under the lead astronomer's credentials.",
        "detail": "The person with exclusive access could make the change."
      }
    ],
    "solution": {
      "suspectId": "case-19-suspect-1",
      "motive": "Reputation",
      "explanation": "The shutter telemetry, lens dust, and star chart correction reveal the recording was sabotaged by the researcher who had exclusive access during calibration.",
      "requiredClues": [
        "case-19-clue-1",
        "case-19-clue-3",
        "case-19-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on star chart correction and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is shutter telemetry, star chart correction, and calibration key. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  },
  {
    "id": "case-20",
    "number": 20,
    "title": "The Last Algorithm",
    "difficulty": "Master Detective",
    "location": "Axiom Research Lab",
    "crime": "Data theft",
    "victim": "a confidential model archive",
    "briefing": "A confidential model archive is at the centre of a data theft investigation at Axiom Research Lab. The first account seems convincing, but the evidence contains contradictions. Examine the scene, compare alibis, and submit a verdict supported by the clues.",
    "suspects": [
      {
        "id": "case-20-suspect-1",
        "name": "Quinn Mercer",
        "role": "The Systems Engineer",
        "profile": "Built the archive export pipeline.",
        "alibi": "My access token had been revoked before midnight."
      },
      {
        "id": "case-20-suspect-2",
        "name": "Ravi Sen",
        "role": "The Research Lead",
        "profile": "Owned the model and its results.",
        "alibi": "I was presenting in the seminar room."
      },
      {
        "id": "case-20-suspect-3",
        "name": "Lena Frost",
        "role": "The Security Analyst",
        "profile": "Managed credential revocation.",
        "alibi": "I reviewed alerts from home."
      },
      {
        "id": "case-20-suspect-4",
        "name": "Noel Park",
        "role": "The Contractor",
        "profile": "Maintained the build server.",
        "alibi": "I only used the staging environment."
      }
    ],
    "clues": [
      {
        "id": "case-20-clue-1",
        "title": "Checksum mismatch",
        "category": "Digital evidence",
        "description": "The archived model hash differs from the signed release manifest.",
        "detail": "The model was replaced or exported after the signed release."
      },
      {
        "id": "case-20-clue-2",
        "title": "Build token",
        "category": "Access record",
        "description": "A build token was used after the revocation timestamp.",
        "detail": "The credential was not actually inactive at the time of export."
      },
      {
        "id": "case-20-clue-3",
        "title": "Terminal wake log",
        "category": "System record",
        "description": "A lab terminal woke from sleep during the contractor's recorded absence.",
        "detail": "Someone used a local session during the export window."
      },
      {
        "id": "case-20-clue-4",
        "title": "Patch signature",
        "category": "Digital evidence",
        "description": "The patch signature matches a private development key, not the release key.",
        "detail": "The exporter had access to a privileged development credential."
      }
    ],
    "solution": {
      "suspectId": "case-20-suspect-1",
      "motive": "Espionage",
      "explanation": "The checksum mismatch, build token, and terminal wake log identify the engineer who exported the model using a supposedly revoked credential.",
      "requiredClues": [
        "case-20-clue-1",
        "case-20-clue-3",
        "case-20-clue-4"
      ]
    },
    "hints": [
      "Start with the timeline. Which statement is contradicted by a physical or recorded detail?",
      "Focus on terminal wake log and compare it with the suspect who had the access described in their profile.",
      "The decisive chain is checksum mismatch, terminal wake log, and patch signature. Together they support one culprit."
    ],
    "rules": "Opening a mystery box costs 18 seconds and 80 points. You have 3 verdict attempts."
  }
];

module.exports = { CASES };
