const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const features = [
  {
    title: "Upload",
    description: "Add documents to a knowledge base",
    href: "/upload",
  },
  {
    title: "Search",
    description: "Semantic search over your docs",
    href: "/search",
  },
  {
    title: "Chat",
    description: "Ask questions with source attribution",
    href: "/chat",
  },
  {
    title: "API docs",
    description: "REST API reference",
    href: `${API_URL}/docs`,
    external: true,
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          KnowAI
        </h1>
        <p className="text-xl text-slate-600">
          Open-Source RAG Knowledge Base Platform
        </p>
        <p className="text-slate-500">
          Deploy in 5 minutes. Own your data. No vendor lock-in.
        </p>
      </section>

      <section>
        <h2 className="sr-only">Get started</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {features.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="text-lg font-semibold text-slate-900">
                  {item.title}
                </span>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
