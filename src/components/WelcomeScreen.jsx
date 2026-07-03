export default function WelcomeScreen({ onPromptClick }) {
  const prompts = [
    'What is the vision of Exodia?',
    'How does Exodia support game developers?',
    'Tell me about innovation in Exodia',
    'What are your plans for the future?',
  ];

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-brand-orange/20">
          E
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Office of the President
        </h1>
        <p className="text-zinc-400 text-sm mb-8">
          Ask anything about Exodia. The President will respond with wisdom, vision, and authority.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPromptClick(prompt)}
              className="text-left px-3 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-zinc-300 hover:border-brand-orange hover:text-white transition-colors truncate"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}