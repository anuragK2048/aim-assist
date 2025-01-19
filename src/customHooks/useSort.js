import { useSearchParams } from "react-router";

export default function useSort(sortingDetails, elements, urlParam) {
  const [searchParams] = useSearchParams();
  const selectedParam = searchParams.get(urlParam);
  elements.sort(sortingDetails[selectedParam]);
  return elements;
}
