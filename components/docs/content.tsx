"use client"

import { Code, CheckCircle, AlertCircle } from 'lucide-react'

export function DocsContent() {
    return (
        <main className="flex-1 min-w-0 max-w-3xl">
            <div className="prose prose-invert max-w-none space-y-12">
                {/* Introduction Section */}
                <section id="introduction" className="scroll-mt-24">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        Welcome to Pointer documentation. This guide will help you get started with our AI-powered development platform and learn how to make the most of its features.
                    </p>
                </section>

                {/* Getting Started Section */}
                <section id="getting-started" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>

                    <div id="introduction" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Introduction</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Pointer is a comprehensive platform that combines AI-powered code analysis, one-click integrations, and real-time collaboration. Whether you're building a new feature or reviewing existing code, Pointer helps you work smarter and faster.
                        </p>
                    </div>

                    <div id="installation" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Installation</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">Get started by installing Pointer on your preferred platform:</p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`npm install @pointer/cli
yarn add @pointer/cli
pnpm add @pointer/cli`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="quick-start" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Quick Start</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">Follow these steps to get up and running:</p>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-foreground font-medium">Create an account</p>
                                    <p className="text-muted-foreground text-sm">Sign up on Pointer to get your API key</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-foreground font-medium">Configure your environment</p>
                                    <p className="text-muted-foreground text-sm">Set your API key in your project environment variables</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-foreground font-medium">Start coding</p>
                                    <p className="text-muted-foreground text-sm">Use Pointer's features in your development workflow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Core Features</h2>

                    <div id="code-reviews" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">AI Code Reviews</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Get instant, intelligent code reviews powered by advanced AI models. Pointer analyzes your code for potential issues, security concerns, and best practice violations.
                        </p>
                    </div>

                    <div id="integrations" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">One-Click Integrations</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Connect with your favorite tools in seconds. Pointer integrates seamlessly with GitHub, GitLab, and other popular development platforms.
                        </p>
                    </div>

                    <div id="previews" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Previews</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            See your changes instantly with real-time preview updates. Collaborate with teammates and review code side-by-side.
                        </p>
                    </div>
                </section>

                {/* Guides Section */}
                <section id="guides" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Guides</h2>

                    <div id="authentication" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Authentication</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">All API requests require authentication using your API key.</p>
                        <div className="bg-muted border border-border rounded-lg p-4">
                            <pre className="text-sm text-foreground overflow-x-auto">
                                <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.pointer.com/v1/reviews`}</code>
                            </pre>
                        </div>
                    </div>

                    <div id="api-setup" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">API Setup</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Configure your API endpoints and authentication credentials. Reference our API documentation for detailed endpoint specifications.
                        </p>
                    </div>

                    <div id="deployment" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Deployment</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Deploy Pointer to your infrastructure using Docker, Kubernetes, or your preferred hosting platform. We provide detailed deployment guides for each option.
                        </p>
                    </div>
                </section>

                {/* API Reference Section */}
                <section id="api" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-foreground mb-4">API Reference</h2>

                    <div id="endpoints" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Endpoints</h3>
                        <div className="space-y-3">
                            <div className="bg-muted border border-border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Code className="w-4 h-4 text-primary" />
                                    <span className="text-primary font-mono text-sm">POST /reviews</span>
                                </div>
                                <p className="text-muted-foreground text-sm">Submit code for review</p>
                            </div>
                            <div className="bg-muted border border-border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Code className="w-4 h-4 text-primary" />
                                    <span className="text-primary font-mono text-sm">GET /reviews/:id</span>
                                </div>
                                <p className="text-muted-foreground text-sm">Get review results</p>
                            </div>
                        </div>
                    </div>

                    <div id="api-auth" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Authentication</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            All API requests must include an Authorization header with your API key.
                        </p>
                    </div>

                    <div id="errors" className="mb-8 scroll-mt-24">
                        <h3 className="text-xl font-semibold text-foreground mb-3">Error Handling</h3>
                        <div className="flex gap-3 p-4 bg-muted border border-border rounded-lg">
                            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-foreground font-medium">Common Errors</p>
                                <p className="text-muted-foreground text-sm mt-1">Check the API response status codes and error messages for troubleshooting information.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24 pb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">FAQ</h2>

                    <div id="questions" className="mb-8 scroll-mt-24">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Common Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-foreground font-medium mb-2">How do I get started?</p>
                                <p className="text-muted-foreground text-sm">Follow our Quick Start guide above to set up your account and configure your first project.</p>
                            </div>
                            <div>
                                <p className="text-foreground font-medium mb-2">What programming languages are supported?</p>
                                <p className="text-muted-foreground text-sm">Pointer supports JavaScript, TypeScript, Python, Java, Go, Rust, and more. Check the full list in our platform documentation.</p>
                            </div>
                            <div>
                                <p className="text-foreground font-medium mb-2">Is there a free tier?</p>
                                <p className="text-muted-foreground text-sm">Yes! Our free tier includes up to 100 reviews per month. See our pricing page for more details.</p>
                            </div>
                        </div>
                    </div>

                    <div id="troubleshooting" className="scroll-mt-24">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Troubleshooting</h3>
                        <p className="text-muted-foreground text-sm mb-4">If you encounter issues, try these solutions:</p>
                        <ul className="text-muted-foreground text-sm space-y-2 ml-4">
                            <li>• Verify your API key is correctly configured</li>
                            <li>• Check your internet connection and firewall settings</li>
                            <li>• Review the error logs in your dashboard</li>
                            <li>• Contact our support team for assistance</li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    )
}
