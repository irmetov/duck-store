import { Container } from "@/components/ui/container";
import { LoadingState } from "@/components/ui/loading-state";

export default function ProductLoading() {
  return (
    <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-image bg-surface-sky" />
        <LoadingState label="Loading product" rows={2} />
      </div>
    </Container>
  );
}
