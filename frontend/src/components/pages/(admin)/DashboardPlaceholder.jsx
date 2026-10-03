export default function DashboardPlaceholder({ title }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        {title} management is coming soon.
      </p>
    </div>
  );
}
