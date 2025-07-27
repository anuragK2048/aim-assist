import { SlashIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useParams } from "react-router";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentBlockStore } from "../store/useCurrentBlock";

export default function NavigationMenuDemo() {
  const goals = useAppStore((s) => s.goals);
  const targets = useAppStore((s) => s.targets);
  const nodes = useAppStore((s) => s.nodes);
  const [pathElementsDetails, setPathElementDetails] = useState(null);
  const [pathNodeIds, setPathNodeIds] = useState<string[]>([]);
  const params = useParams();
  const { setBlock } = useCurrentBlockStore();

  useEffect(() => {
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
      const calculatePathNodeIds = params["*"]
        .split("/")
        .filter((nodeId) => nodeId !== "nodes");
      setPathNodeIds(calculatePathNodeIds);
      calculatePathNodeIds.forEach((nodeId, i, arr) => {
        const selectedNode = nodes.find((node) => node.id === nodeId);
        const relatedNodes = nodes.filter(
          (node) =>
            node.id !== nodeId &&
            node.target_id === params.targetId &&
            ((node.parent_node_id === null && i === 0) ||
              node.parent_node_id === arr[i - 1])
        );
        const nodeObj = {
          selectedNode,
          relatedNodes,
        };
        pathNodesDetails.push(nodeObj);
      });
    }

    if (pathNodesDetails.length > 0) {
      setBlock(
        pathNodesDetails.at(-1).selectedNode,
        "nodes",
        pathNodesDetails.at(-1).selectedNode?.id
      );
    } else if (targetObj.selectedTarget) {
      setBlock(
        targetObj.selectedTarget,
        "targets",
        targetObj.selectedTarget.id
      );
    } else {
      setBlock(goalObj.selectedGoal, "goals", goalObj.selectedGoal?.id);
    }

    setPathElementDetails({
      goal: goalObj,
      target: targetObj,
      nodes: pathNodesDetails,
    });
  }, [params, goals, targets, nodes]);

  function determineNodesPath(index, selectedNodeId) {
    let nodePath = "";
    for (let i = 0; i < index; i++) {
      nodePath += `/${pathNodeIds[i]}`;
    }
    nodePath += `/${selectedNodeId}`;
    return nodePath;
  }

  return (
    <>
      {pathElementsDetails && goals.length && targets.length ? (
        <NavigationMenu viewport={false} className="z-50">
          <NavigationMenuList>
            {/* Goal */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Link to={`/goals/${pathElementsDetails.goal.selectedGoal.id}`}>
                  {pathElementsDetails.goal.selectedGoal.title}
                </Link>
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

            {/* Nodes */}
            {pathElementsDetails.nodes.length > 0 &&
              pathElementsDetails.nodes.map((nodeObj, i, arr) => (
                <React.Fragment key={nodeObj.selectedNode?.id}>
                  <BreadcrumbSeparator>
                    <SlashIcon />
                  </BreadcrumbSeparator>
                  <NavigationMenuItem>
                    {nodeObj.relatedNodes.length ? (
                      <>
                        <NavigationMenuTrigger>
                          <Link
                            to={`/goals/${params.goalId}/targets/${
                              params.targetId
                            }/nodes${determineNodesPath(
                              i,
                              nodeObj.selectedNode?.id
                            )}`}
                          >
                            {nodeObj.selectedNode?.title}
                          </Link>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {nodeObj.relatedNodes.map((node) => (
                            <NavigationMenuLink key={node.id} asChild>
                              <Link
                                to={`/goals/${params.goalId}/targets/${
                                  params.targetId
                                }/nodes${determineNodesPath(i, node.id)}`}
                              >
                                {node.title}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link
                          to={`/goals/${params.goalId}/targets/${
                            params.targetId
                          }/nodes${determineNodesPath(
                            i,
                            nodeObj.selectedNode?.id
                          )}`}
                        >
                          {nodeObj.selectedNode?.title}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                </React.Fragment>
              ))}
          </NavigationMenuList>
        </NavigationMenu>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
}
