interface ComponentDemoProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const ComponentDemo = ({ title, children }: ComponentDemoProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="p-6 border border-border rounded-lg bg-card">
        {children}
      </div>
    </div>
  );
};
