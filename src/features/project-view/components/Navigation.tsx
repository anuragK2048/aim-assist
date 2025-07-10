import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  SlashIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useLocation, useParams } from "react-router";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function NavigationMenuDemo() {
  const goals = useAppStore((s) => s.goals);
  const targets = useAppStore((s) => s.targets);
  const nodes = useAppStore((s) => s.nodes);
  const [pathElementsDetails, setPathElementDetails] = useState(null);
  const params = useParams();

  useEffect(() => {
    console.log(location);
    console.log(params);
    const selectedGoal = goals.find((goal) => goal.id === params.goalId);
    const otherGoals = goals.filter((goal) => goal.id !== params.goalId);
    const goalObj = {
      selectedGoal,
      otherGoals,
    };

    const selectedTarget = targets.find(
      (target) => target.id === params.targetId
    );
    const relatedTargets = targets.filter(
      (target) =>
        target.goal_id === params.goalId && target.id !== params.targetId
    );
    const targetObj = {
      selectedTarget,
      relatedTargets,
    };

    const pathNodesDetails: any = [];
    if (params["*"]) {
      const pathNodeIds = params["*"].split("/");
      console.log(pathNodeIds);
      pathNodeIds.forEach((nodeId, i, arr) => {
        const selectedNode = nodes.find((node) => node.id === nodeId);
        const relatedNodes = nodes.filter((node) =>
          node.target_id
            ? node.target_id === params.targetId && node.id !== nodeId
            : node.parent_node_id === arr[i - 1] && node.id !== nodeId
        );
        const nodeObj = {
          selectedNode,
          relatedNodes,
        };
        pathNodesDetails.push(nodeObj);
      });
    }

    setPathElementDetails({
      goal: goalObj,
      target: targetObj,
      nodes: pathNodesDetails,
    });
    console.log({ goal: goalObj, target: targetObj, nodes: pathNodesDetails });
  }, [params]);

  return (
    <>
      {console.log(pathElementsDetails)}
      {pathElementsDetails ? (
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {/* Goal */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {pathElementsDetails.goal.selectedGoal.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {pathElementsDetails.goal.otherGoals.map((goal) => (
                  <NavigationMenuLink key={goal.id} asChild>
                    <Link to={`/goals/${goal.id}`}>{goal.title}</Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Target */}
            {pathElementsDetails.target.selectedTarget && (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <NavigationMenuItem>
                  {pathElementsDetails.target.relatedTargets.length ? (
                    <>
                      <NavigationMenuTrigger>
                        <Link
                          to={`/goals/${params.goalId}/targets/${params.targetId}`}
                        >
                          {pathElementsDetails.target.selectedTarget.title}
                        </Link>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        {pathElementsDetails.target.relatedTargets.map(
                          (target) => (
                            <NavigationMenuLink key={target.id} asChild>
                              <Link
                                to={`/goals/${params.goalId}/targets/${target.id}`}
                              >
                                {target.title}
                              </Link>
                            </NavigationMenuLink>
                          )
                        )}
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link
                        to={`/goals/${params.goalId}/targets/${params.targetId}`}
                      >
                        {pathElementsDetails.target.selectedTarget.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              </>
            )}

            {/* Node/s */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">Components</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Documentation</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Blocks</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">Components</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Documentation</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Blocks</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
}
