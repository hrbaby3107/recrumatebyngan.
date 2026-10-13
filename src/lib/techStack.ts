import type { SelectOption } from "../components/ui/SearchableSelect";

export const TECH_GROUPS: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Svelte", "TypeScript",
      "JavaScript", "HTML/CSS", "Tailwind CSS", "Redux", "jQuery",
    ],
  },
  {
    group: "Backend",
    items: [
      "Node.js", "NestJS", "Express.js", "Python", "Django", "FastAPI", "Flask",
      "Java", "Spring Boot", "C#", ".NET", "ASP.NET Core", "PHP", "Laravel", "Ruby",
      "Ruby on Rails", "Go", "Rust", "Scala", "C++", "Elixir",
    ],
  },
  {
    group: "Mobile",
    items: [
      "React Native", "Flutter", "Swift", "SwiftUI", "Kotlin", "Android", "iOS",
      "Objective-C",
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins",
      "GitHub Actions", "GitLab CI/CD", "CI/CD", "Ansible", "Linux", "Nginx",
    ],
  },
  {
    group: "Databases",
    items: [
      "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQL Server", "Oracle",
      "Elasticsearch", "Cassandra", "DynamoDB", "Firebase",
    ],
  },
  {
    group: "APIs & Messaging",
    items: ["GraphQL", "REST API", "gRPC", "Kafka", "RabbitMQ", "Microservices"],
  },
  {
    group: "Data & AI",
    items: [
      "SQL", "Spark", "Airflow", "Hadoop", "Snowflake", "Power BI", "Tableau",
      "Data Engineering", "Machine Learning", "TensorFlow", "PyTorch", "LLM",
    ],
  },
  {
    group: "QA & Testing",
    items: [
      "Selenium", "Cypress", "Playwright", "Jest", "JUnit", "Postman", "Appium",
      "JMeter", "Automation Testing", "Manual Testing",
    ],
  },
  {
    group: "Other",
    items: [
      "Git", "Agile/Scrum", "Unity", "Unreal Engine", "Solidity", "SAP", "Salesforce",
    ],
  },
];

export const TECH_OPTIONS: SelectOption[] = TECH_GROUPS.flatMap((g) =>
  g.items.map((value) => ({ value, label: value, group: g.group }))
);
