import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <Heading as="h1" size="xl" className="mt-3">
        This duck flew the coop
      </Heading>
      <Text tone="muted" className="mt-3 max-w-md">
        We couldn&apos;t find that page. Head back to the flock and keep
        shopping.
      </Text>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">Shop ducks</Link>
        </Button>
      </div>
    </Container>
  );
}
