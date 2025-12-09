"use client"

import { Code, CheckCircle, AlertCircle, FileText, Database, GitBranch, Terminal } from 'lucide-react'

export function DocsContent() {
    return (
        <main className="flex-1 min-w-0 max-w-3xl">
            <div className="prose prose-invert max-w-none space-y-12">
                {/* Getting Started Section */}
                <section id="getting-started" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Getting Started</h1>

                    <div id="backend-setup" className="mt-4 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Initialize the Base Backend</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To start with an empty base backend repository, clone the following repo, then you can use the CLI:
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4 mb-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`git clone git@github.com:ameng10/Conceptual_Base_Repo.git`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="running-server" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Running the Server</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            First, generate imports (required before running):
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4 mb-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`deno task import`}</code>
                            </pre>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Start the main application server:
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4 mb-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`deno task start`}</code>
                            </pre>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Or start the concept API server specifically:
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`deno task concepts -- --port 3000`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="running-tests" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Running Tests</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Run all tests using Deno's test runner:
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4 mb-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`deno test --allow-net --allow-read --allow-write --allow-sys --allow-env`}</code>
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Concept Design Section */}
                <section id="concept-design-overview" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Concept Design</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        Concept design is a new approach to software development that attempts to find greater modularity in the structuring of the functionality of applications. The key idea is to break the functionality down into separable, modular services called <em>concepts</em>, each of which can be specified, implemented and understood separately -- by users and by developers.
                    </p>
                    <div className="my-4">
                        <h3 className="text-xl font-semibold text-foreground mb-2">Advantages</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Improved separation of concerns resulting in simpler and more robust design and implementation</li>
                            <li>Greater recognition of reusable behaviors, so reduced work for designers and developers and more familiar interactions for users</li>
                            <li>Improved focus on the purposes and motivations of the functionality</li>
                        </ul>
                    </div>

                    <div id="what-is-a-concept" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">What is a concept?</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            A concept is a reusable unit of user-facing functionality that serves a well-defined and intelligible purpose. Each concept maintains its own state, and interacts with the user (and with other concepts) through atomic actions.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            A concept typically involves objects of several different kinds, holding relationships between them in its state. For example, the <em>Upvote</em> concept maintains a relationship between items and users who have approved them.
                        </p>
                    </div>

                    <div id="concept-independence" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Concept Independence</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Perhaps the most significant distinguishing feature of concepts is their mutual independence. Each concept is defined without reference to any other concepts, and can be understood in isolation.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Polymorphism is key to independence: the designer of a concept should strive to make the concept as free as possible of any assumptions about the content and interpretation of objects passed as action arguments.
                        </p>
                    </div>

                    <div id="separation-of-concerns" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Separation of Concerns</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In a concept design, concerns are separated into different concepts rather than being conflated in objects. For example:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>UserAuthentication</strong>: maps user identifiers to usernames and passwords</li>
                            <li><strong>Profile</strong>: maps user identifiers to bios and thumbnail images</li>
                            <li><strong>Notification</strong>: maps user identifiers to phone numbers and email addresses</li>
                        </ul>
                    </div>

                    <div id="composition-by-synchronization" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Composition by Synchronization</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Because concepts are fully independent, they are composed using <em>synchronizations</em> (or <em>syncs</em>). A sync is a rule that says that <em>when</em> an action happens in one concept, <em>where</em> the state of some concept has some property, <em>then</em> some action happens in another concept.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4 my-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`sync CascadePostDeletion
when
    Post.delete (p)
where
    in Comment: target of c is p
then
    Comment.delete (c)`}</code>
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Specifications Section */}
                <section id="spec-structure" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Specifications</h1>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        A concept is specified with the following structure:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                        <li><strong>concept</strong>: a descriptive name and type parameters</li>
                        <li><strong>purpose</strong>: the reason for why this concept exists</li>
                        <li><strong>principle</strong>: a motivating scenario</li>
                        <li><strong>state</strong>: a description of the stored state</li>
                        <li><strong>actions</strong>: operational steps (mutators)</li>
                    </ul>

                    <div id="spec-purpose" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Purpose</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The purpose defines the motivation for the concept's existence. A good purpose should be need-focused, specific, and evaluable.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <p className="text-sm font-mono mb-2"><strong>purpose</strong> support deletion of items with possibility of restoring</p>
                            <p className="text-sm text-muted-foreground">(Example for Trash concept)</p>
                        </div>
                    </div>

                    <div id="spec-principle" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Principle</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The operational principle is an archetypal scenario that explains how the concept fulfills its purpose. It's often a "story" of how the concept is used.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <p className="text-sm font-mono mb-2"><strong>principle</strong> after a style is defined and applied to multiple paragraphs, updating the style will cause the format of all those paragraphs to be updated in concert</p>
                        </div>
                    </div>

                    <div id="spec-state" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">State</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The concept state is a data model representing the set of possible states.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`state
  a set of Users with
    a username String
    a password String`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="spec-actions" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Actions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Actions are specified in pre/post style (requires/effects). Preconditions are firing conditions: an action can never occur when its precondition is false.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`actions
  register (username: String, password: String): (user: User)
    requires ...
    effects ...`}</code>
                            </pre>
                        </div>
                    </div>

                     <div id="spec-queries" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Queries</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Queries are reads of the concept state. They often begin with an underscore (e.g., <code>_getUsername</code>).
                        </p>
                    </div>
                </section>

                {/* Implementation Section */}
                <section id="impl-overview" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Implementation</h1>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Concepts are implemented as TypeScript classes.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                        <li>No import statements can reference another concept.</li>
                        <li>All methods are either actions or queries.</li>
                        <li>Every action takes a single dictionary argument and returns a single dictionary.</li>
                    </ul>

                    <div id="impl-ids" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Managing IDs</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            When using MongoDB, we use string-based IDs. A helper utility <code>ID</code> is provided.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

type Item = ID;

const item = {
    _id: freshID(),
};`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="impl-state-actions" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">State & Actions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            State relations map directly to MongoDB collections. Actions are methods on the class.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`export default class LabelingConcept {
  items: Collection<Items>;
  labels: Collection<Labels>;

  constructor(private readonly db: Db) {
    this.items = this.db.collection(PREFIX + "items");
    this.labels = this.db.collection(PREFIX + "labels");
  }

  createLabel({ name }: { name: string }): Empty {
    // Implementation
    return {};
  }
}`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="impl-dictionaries" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Dictionaries</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Arguments and results are always dictionaries.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Actions</strong>: Return a single dictionary (or <code>error</code> key).</li>
                            <li><strong>Queries</strong>: Return an <strong>array</strong> of dictionaries.</li>
                        </ul>
                    </div>

                    <div id="impl-setup" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Setup & Error Handling</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Use <code>getDb()</code> from <code>@utils/database.ts</code> for initialization.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Only throw errors when truly exceptional. Otherwise, return <code>{`{ error: "message" }`}</code> to allow synchronization.
                        </p>
                    </div>
                </section>

                {/* Synchronizations Section */}
                <section id="sync-overview" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Synchronizations</h1>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Synchronizations are implemented in <code>src/syncs/</code> using a lightweight TypeScript DSL.
                    </p>

                    <div id="sync-example" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Example</h2>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`export const ButtonIncrement: Sync = ({}) => ({
    when: actions(
        [Button.clicked, { kind: "increment_counter" }, {}],
    ),
    then: actions(
        [Counter.increment, {}, {}],
    ),
});`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="sync-frames" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Working with Frames</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The <code>where</code> clause receives and returns a set of <code>Frames</code>. You can query concept state to enrich frames.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`where: async (frames) => {
    frames = await frames.query(Counter._getCount, {}, { count })
    return frames.filter(($) => $[count] >= 10);
},`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="sync-pattern-matching" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Pattern Matching</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Pattern matching occurs on a need-basis. You can omit parameters you don't care about.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Note:</strong> <code>$[variable]</code> syntax is used to refer to variables in frames, as they are symbols.
                        </p>
                    </div>

                    <div id="sync-pitfalls" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Common Pitfalls</h2>
                         <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Zero Matches:</strong> If a query returns no frames, the sync does not fire. Handle empty results explicitly if needed.</li>
                            <li><strong>Missing actionId:</strong> Ensure your <code>where</code> clause is async and awaits all queries.</li>
                        </ul>
                    </div>
                </section>

                {/* Testing Section */}
                <section id="testing-approach" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Testing</h1>
                    <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            Testing concepts involves:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                            <li>Confirming <strong>requires</strong> and <strong>effects</strong> for each action.</li>
                            <li>Ensuring the <strong>principle</strong> is fully modeled by the actions.</li>
                        </ol>
                    </div>

                    <div id="testing-implementation" className="mt-8 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Implementation</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Use the <code>testDb</code> helper and Deno's test runner.
                        </p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`import { testDb } from "@utils/database.ts";

Deno.test("...", async () => {
  const [db, client] = await testDb();
  // ... tests
  await client.close();
});`}</code>
                            </pre>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
