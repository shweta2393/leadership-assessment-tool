import { AssessmentConfig } from "@/lib/domain/types";

export const assessmentConfig: AssessmentConfig = {
  dimensions: [
    {
      id: "decisionMaking",
      label: "Decision-Making",
      description: "How you evaluate options and make timely decisions.",
      lowFeedback:
        "You may hesitate or rely on incomplete criteria. Focus on defining decision inputs and explicit deadlines.",
      mediumFeedback:
        "You make sound decisions in familiar scenarios. Strengthen consistency by using a repeatable decision framework.",
      highFeedback:
        "You make clear, timely, and balanced decisions. Keep mentoring others on prioritization and trade-off thinking.",
    },
    {
      id: "teamCommunication",
      label: "Team Communication",
      description: "How clearly and consistently you communicate with others.",
      lowFeedback:
        "Communication may be unclear or infrequent. Improve by setting regular updates and confirming shared understanding.",
      mediumFeedback:
        "Your communication is generally effective. Increase impact by adapting style to audience and context.",
      highFeedback:
        "You communicate with clarity and trust. Continue reinforcing alignment through active listening and feedback loops.",
    },
    {
      id: "strategicThinking",
      label: "Strategic Thinking",
      description: "How well you connect short-term actions to long-term outcomes.",
      lowFeedback:
        "You may focus heavily on immediate tasks. Practice scenario planning and measurable long-term goals.",
      mediumFeedback:
        "You show strategic awareness in key moments. Improve by defining clearer long-range assumptions and risks.",
      highFeedback:
        "You consistently connect execution to strategic outcomes. Keep stress-testing plans against changing conditions.",
    },
  ],
  questions: [
    {
      id: "q1",
      text: "I gather relevant facts before making important decisions.",
      dimensionId: "decisionMaking",
    },
    {
      id: "q2",
      text: "I make decisions in a timely way, even under pressure.",
      dimensionId: "decisionMaking",
    },
    {
      id: "q3",
      text: "I explain the rationale behind my decisions clearly.",
      dimensionId: "decisionMaking",
    },
    {
      id: "q4",
      text: "I communicate expectations clearly to my team.",
      dimensionId: "teamCommunication",
    },
    {
      id: "q5",
      text: "I actively listen and invite input from others.",
      dimensionId: "teamCommunication",
    },
    {
      id: "q6",
      text: "I provide timely updates when priorities or plans change.",
      dimensionId: "teamCommunication",
    },
    {
      id: "q7",
      text: "I connect day-to-day work to broader organizational goals.",
      dimensionId: "strategicThinking",
    },
    {
      id: "q8",
      text: "I anticipate risks and opportunities ahead of time.",
      dimensionId: "strategicThinking",
    },
    {
      id: "q9",
      text: "I balance immediate delivery with long-term impact.",
      dimensionId: "strategicThinking",
    },
  ],
  scoreBands: {
    lowMax: 2.5,
    mediumMax: 3.8,
  },
};

export const likertOptions = [
  { value: 1, label: "1 - Strongly Disagree" },
  { value: 2, label: "2 - Disagree" },
  { value: 3, label: "3 - Neutral" },
  { value: 4, label: "4 - Agree" },
  { value: 5, label: "5 - Strongly Agree" },
];
