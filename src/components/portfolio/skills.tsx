import { Badge } from "@/components/ui/badge";

export default function Skills({ skills }: { skills: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {skills.map((skill) => (
        <Badge
          key={skill}
          variant="outline"
          className="luxury-tag"
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}
