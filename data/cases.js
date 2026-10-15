// Demonstration case data. Keep solutions on the server; never send solution fields to the browser.
module.exports = [
  {
    caseId: 1,
    title: "The Missing Ledger",
    difficulty: "Easy",
    story: "At 9:15 PM, the charity gala's donation ledger vanished from a locked office. Three people had a reason to enter.",
    suspects: [
      { name: "Mara Finch", occupation: "Event coordinator", statement: "I was arranging the final speeches." },
      { name: "Elliot Crane", occupation: "Accountant", statement: "I left the office before the guests arrived." },
      { name: "Nina Vale", occupation: "Photographer", statement: "I was taking portraits in the east hall." }
    ],
    clues: [
      { title: "Wet Footprints", description: "A trail of damp prints leads from the office to the service corridor." },
      { title: "Camera Gap", description: "The hallway camera was covered for exactly four minutes." },
      { title: "Ink Smudge", description: "Fresh blue ink marks the edge of a catering cart." },
      { title: "Call Log", description: "A call to the service desk was placed at 9:11 PM." }
    ],
    solution: {
      suspect: "Mara Finch",
      evidence: ["Camera Gap", "Ink Smudge"],
      explanation: "Mara had access to the event equipment and used the catering cart during the camera gap."
    }
  },
  {
    caseId: 2,
    title: "A Toast Too Late",
    difficulty: "Easy",
    story: "A priceless glass vanished during a midnight toast. The display case was not forced, and only three guests had access to the gallery.",
    suspects: [
      { name: "Jonas Reed", occupation: "Collector", statement: "I stayed beside the fireplace." },
      { name: "Priya Sen", occupation: "Curator", statement: "I checked the gallery before the toast." },
      { name: "Theo Marsh", occupation: "Waiter", statement: "I cleared the glasses after midnight." }
    ],
    clues: [
      { title: "Polished Key", description: "A key-shaped shine is visible on the curator's glove." },
      { title: "Empty Tray", description: "A serving tray has a circular dust-free mark matching the missing glass." },
      { title: "Gallery Dust", description: "The display shelf was wiped clean shortly before the toast." },
      { title: "Witness Note", description: "A guest saw someone wearing curator gloves near the case." }
    ],
    solution: {
      suspect: "Priya Sen",
      evidence: ["Polished Key", "Gallery Dust"],
      explanation: "Priya had authorized access and wiped the shelf after removing the glass."
    }
  }
];
