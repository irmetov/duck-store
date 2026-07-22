import { Container } from "@/components/ui/container";
import { LoadingState } from "@/components/ui/loading-state";

export default function ProductsLoading() {
  return (
    <Container className="py-12">
      <LoadingState label="Loading products" rows={8} />
    </Container>
  );
}
