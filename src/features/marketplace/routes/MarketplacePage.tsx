import { predefinedTemplates } from "@/data/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { Goal, Target, Node, Task } from "@/types";

function MarketplacePage() {
  const importTemplate = useAppStore((state) => state.importTemplate);
  const authUser = useAppStore((state) => state.auth.user);
  const importTemplate = useAppStore((state) => state.importTemplate);

  const handleImportTemplate = async (template) => {
    if (!authUser) {
      console.error("User not authenticated.");
      return;
    }

    await importTemplate(template);
    alert(`Template '${template.name}' imported successfully!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Template Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predefinedTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Goal:</h3>
              <p>{template.goal.title}</p>
              {template.targets.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Targets:</h3>
                  <ul className="list-disc pl-5">
                    {template.targets.map((target, index) => (
                      <li key={index}>{target.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleImportTemplate(template)}>
                Import Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MarketplacePage;
