import Image from "next/image"

interface Testimonial {
  quote: string
  name: string
  company: string
  avatar: string
  type: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Modern codebases are often so illegible that even small changes risk breaking hidden behavior. Our work shows that structuring systems as independent concepts plus synchronizations makes backends far more modular, explainable, and amenable to LLM-based generation.",
    name: "Eagon Meng & Daniel Jackson",
    company: "MIT CSAIL · “What You See Is What It Does”",
    avatar: "/images/avatars/meng-jackson.png",
    type: "large-teal",
  },
  {
    quote:
      "Developers still rely on opportunistic reuse—copying snippets and patching them together. AI-native software engineering needs reusable higher-level components, not just raw code.",
    name: "Antero Taivalsaari et al.",
    company: "On the Future of Software Reuse in the Era of AI Native SE",
    avatar: "/images/avatars/taivalsaari.png",
    type: "small-dark",
  },
  {
    quote:
      "Large systems already depend on countless third-party components, but in a messy, ad-hoc way. Without structured reusable units, maintenance and evolution remain fragile.",
    name: "Niko Mäkitalo et al.",
    company: "University of Helsinki · On Opportunistic Software Reuse",
    avatar: "/images/avatars/makitalo.png",
    type: "small-dark",
  },
  {
    quote:
      "Developers spend only about a third of their time actually writing or improving code. The rest disappears into maintenance and glue work that better reuse could eliminate.",
    name: "Chris Grams",
    company: "The New Stack · “How Much Time Do Developers Spend Actually Writing Code?”",
    avatar: "/images/avatars/chris-grams.png",
    type: "small-dark",
  },
  {
    quote:
      "Sixty-nine percent of developers lose at least eight hours every week to inefficiencies like technical debt and poor tooling—effectively an entire workday gone.",
    name: "Milena Radivojević",
    company: "ShiftMag · “Developers waste 8+ hours weekly on inefficiencies like technical debt”",
    avatar: "/images/avatars/milena-radivojevic.png",
    type: "small-dark",
  },
  // {
  //   quote:
  //     "Our results indicate that systematic reuse of proven components significantly improves productivity and quality, cutting development time and reducing risk—provided the reusable assets are discoverable and well-structured.",
  //   name: "Ahmed M. El-Halawany et al.",
  //   company: "Scientific Reports · “Improving reuse during the development process for web systems”",
  //   avatar: "/images/avatars/el-halawany.png",
  //   type: "small-dark",
  // },
  // {
  //   quote:
  //     "Developer surveys around LLM coding assistants consistently show that much of the generated code is not performant or production-ready. Teams still have to invest substantial effort to review, optimize, and harden AI-written code before it can ship.",
  //   name: "Saurabh Misra",
  //   company: "The New Stack · “Does LLM Write Performant Code? Study Says No”",
  //   avatar: "/images/avatars/saurabh-misra.png",
  //   type: "small-dark",
  // },
  // {
  //   quote:
  //     "After talking with dozens of teams about their shared component libraries, we found a common pattern: reusable components are something everyone aspires to, but without the right tooling and workflows, most libraries quietly decay and are underused.",
  //   name: "Jonathan Saring",
  //   company: "Bits and Pieces · “How Do We Really Use Reusable Components?”",
  //   avatar: "/images/avatars/jonathan-saring.png",
  //   type: "small-dark",
  // },
  {
    quote:
      "Teams know reuse boosts quality and productivity, but they still rebuild components from scratch because finding, adapting, and integrating existing assets is too costly.",
    name: "Xingru Chen et al.",
    company: "Blekinge Institute of Technology · Information and Software Technology",
    avatar: "/images/avatars/xingru-chen.png",
    type: "small-dark",
  },
  {
    quote:
      "On BaxBench, even state-of-the-art LLMs reach only around 60% correctness on backend tasks, many still vulnerable. Today’s models can’t reliably generate secure, deployment-ready backends in one shot.",
    name: "Mark Vero et al.",
    company: "ETH Zurich · BaxBench: Can LLMs Generate Correct and Secure Backends?",
    avatar: "/images/avatars/vero.png",
    type: "large-light",
  },
];


const _testimonials = [
  {
    quote:
      "The real-time code suggestions from Pointer feel like having a senior engineer reviewing every line of code as you write. The accuracy of its recommendations has improved our overall code quality, reduced review time.",
    name: "Annette Black",
    company: "Sony",
    avatar: "/images/avatars/annette-black.png",
    type: "large-teal",
  },
  {
    quote:
      "Integrating Pointer into our stack was smooth, and the MCP server connections saved us days of configuration work",
    name: "Dianne Russell",
    company: "McDonald's",
    avatar: "/images/avatars/dianne-russell.png",
    type: "small-dark",
  },
  {
    quote:
      "Pointer’s multi-agent coding feature has been a game changer. We’re fixing complex bugs in hours instead of spending entire sprints on them.",
    name: "Cameron Williamson",
    company: "IBM",
    avatar: "/images/avatars/cameron-williamson.png",
    type: "small-dark",
  },
  {
    quote:
      "We no longer juggle multiple tools. Pointer brought all our integrations together in one place, which simplified our entire workflow.",
    name: "Robert Fox",
    company: "MasterCard",
    avatar: "/images/avatars/robert-fox.png",
    type: "small-dark",
  },
  {
    quote:
      "We started with the free plan just to test it out, but within a week we upgraded to Pro. Now, we can’t imagine coding without it",
    name: "Darlene Robertson",
    company: "Ferrari",
    avatar: "/images/avatars/darlene-robertson.png",
    type: "small-dark",
  },
  {
    quote:
      "Collaborative coding feels effortless now. With Pointer’s real-time previews, pair programming has become faster and more productive.",
    name: "Cody Fisher",
    company: "Apple",
    avatar: "/images/avatars/cody-fisher.png",
    type: "small-dark",
  },
  {
    quote:
      "Deploying on Vercel with Pointer was not just simple, it felt seamless. We went from coding to seeing our changes live in minutes without worrying about build pipelines or configuration issues.",
    name: "Albert Flores",
    company: "Louis Vuitton",
    avatar: "/images/avatars/albert-flores.png",
    type: "large-light",
  },
]

const TestimonialCard = ({ quote, name, company, avatar, type }: Testimonial) => {
  const isLargeCard = type.startsWith("large")
  const avatarSize = isLargeCard ? 48 : 36
  const avatarBorderRadius = isLargeCard ? "rounded-[41px]" : "rounded-[30.75px]"
  const padding = isLargeCard ? "p-6" : "p-[30px]"

  let cardClasses = `flex flex-col justify-between items-start overflow-hidden rounded-[10px] shadow-[0px_2px_4px_rgba(0,0,0,0.08)] relative ${padding}`
  let quoteClasses = ""
  let nameClasses = ""
  let companyClasses = ""
  let backgroundElements = null
  let cardHeight = ""
  const cardWidth = "w-full md:w-[384px]"

  if (type === "large-teal") {
    cardClasses += " bg-primary"
    quoteClasses += " text-primary-foreground text-2xl font-medium leading-8"
    nameClasses += " text-primary-foreground text-base font-normal leading-6"
    companyClasses += " text-primary-foreground/60 text-base font-normal leading-6"
    cardHeight = "h-[502px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else if (type === "large-light") {
    cardClasses += " bg-[rgba(231,236,235,0.12)]"
    quoteClasses += " text-foreground text-2xl font-medium leading-8"
    nameClasses += " text-foreground text-base font-normal leading-6"
    companyClasses += " text-muted-foreground text-base font-normal leading-6"
    cardHeight = "h-[502px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else {
    cardClasses += " bg-card outline outline-1 outline-border outline-offset-[-1px]"
    quoteClasses += " text-foreground/80 text-[17px] font-normal leading-6"
    nameClasses += " text-foreground text-sm font-normal leading-[22px]"
    companyClasses += " text-muted-foreground text-sm font-normal leading-[22px]"
    cardHeight = "h-[244px]"
  }

  return (
    <div className={`${cardClasses} ${cardWidth} ${cardHeight}`}>
      {backgroundElements}
      <div className={`relative z-10 font-normal break-words ${quoteClasses}`}>{quote}</div>
      <div className="relative z-10 flex justify-start items-center gap-3">
        {/* <Image
          src={avatar || "/placeholder.svg"}
          alt={`${name} avatar`}
          width={avatarSize}
          height={avatarSize}
          className={`w-${avatarSize / 4} h-${avatarSize / 4} ${avatarBorderRadius}`}
          style={{ border: "1px solid rgba(255, 255, 255, 0.08)" }}
        /> */}
        <div className="flex flex-col justify-start items-start gap-0.5 mt-3">
          <div className={nameClasses}>{name}</div>
          <div className={companyClasses}>{company}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialGridSection() {
  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start py-6 md:py-8 lg:py-14">
      <div className="self-stretch py-6 md:py-8 lg:py-14 flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight md:leading-tight lg:leading-[40px]">
            Coding made effortless
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm md:text-sm lg:text-base font-medium leading-[18.20px] md:leading-relaxed lg:leading-relaxed">
            {"Hear how developers ship products faster, collaborate seamlessly,"} <br />{" "}
            {"and build with confidence using Pointer's powerful AI tools"}
          </p>
        </div>
      </div>
      <div className="w-full pt-0.5 pb-4 md:pb-6 lg:pb-10 flex flex-col md:flex-row justify-center items-start gap-4 md:gap-4 lg:gap-6 max-w-[1100px] mx-auto">
        <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[0]} />
          <TestimonialCard {...testimonials[1]} />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[2]} />
          <TestimonialCard {...testimonials[3]} />
          <TestimonialCard {...testimonials[4]} />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[5]} />
          <TestimonialCard {...testimonials[6]} />
        </div>
      </div>
    </section>
  )
}
