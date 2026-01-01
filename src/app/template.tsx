interface TemplateProps {
  children: React.ReactNode
}

export default function Template({ children }: TemplateProps) {
  return <div className="animate-fade-in">{children}</div>
}
