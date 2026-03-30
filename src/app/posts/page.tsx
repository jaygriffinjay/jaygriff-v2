import { getAllPublished } from "@/lib/content";
import { H1, Paragraph, Small, Link } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";

export default async function PostsPage() {
  const posts = await getAllPublished("post");

  return (
    <Container>
      <div className="mb-10">
        <H1 className="text-4xl font-bold tracking-tight">Posts</H1>
        <Paragraph className="text-muted-foreground mt-3">
          Writing, opinions, and longer-form thoughts.
        </Paragraph>
      </div>

      <Separator className="mb-10" />

      {posts.length === 0 ? (
        <Paragraph className="text-muted-foreground">Nothing published yet.</Paragraph>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="no-underline">
              <Card className="border-border/60 hover:border-border h-full transition-all hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                  {post.description && (
                    <CardDescription>{post.description}</CardDescription>
                  )}
                  <Small className="text-muted-foreground/60 mt-1">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Small>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
