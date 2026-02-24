import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import Section from "@/components/ui/Section";

export default function DemosPage() {
    const posts = getAllPosts();

    return (
        <Section title="Demos">
            <ul className="space-y-6">
                {posts.map((post) => (
                    <li key={post.slug} className="border-b pb-4">
                        <Link
                            href={`/demos/${post.slug}`}
                            className="text-xl font-semibold hover:underline"
                        >
                            {post.title}
                        </Link>

                        <p className="text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString()}
                        </p>

                        {post.excerpt && (
                            <p className="mt-2 text-gray-700">{post.excerpt}</p>
                        )}
                    </li>
                ))}
            </ul>
        </Section >
    );
}