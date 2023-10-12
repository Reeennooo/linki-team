import type { NextPage } from "next"
import PageHead from "components/PageHead"
import Header from "components/header"
import QuikStart from "components/QuikStart/QuikStart"
import UseCases from "components/UseCases/UseCases"
import AreasSection from "components/AreasSection/AreasSection"
import ProductsSection from "components/ProductsSection/ProductsSection"
import WhyLinki from "components/WhyLinki/WhyLinki"
import ForTeamSection from "components/ForTeamSection/ForTeamSection"
import ForExpertSection from "components/ForExpertSection/ForExpertSection"
import FooterLarge from "components/FooterLarge/FooterLarge"
import TeamsSection from "components/TeamsSection/TeamsSection"
import OurPartnersSection from "components/OurPartnersSection/OurPartnersSection"
import { getCookie, removeCookies } from "cookies-next"
import { USER_TOKEN_COOKIE } from "utils/constants"
import { authApi } from "redux/api/auth"
import { wrapper } from "redux/store"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

export const newText = {
  quikstartSection: [
    {
      title: `<span>Better way</span><br/> to bring your ideas to life<br> and drive results`,
      subtitle:
        "Linki is your go-to platform to turn<br/> your vision into reality. We connect<br/> you with top-class tech and design<br/> teams that will help you quickly test<br/> and validate ideas, build products<br/> and grow them to success.",
      searchText: "Let’s build something great",
      class: "text1",
    },
    {
      title: `<span>Better way</span><br/> to execute ideas\n and drive results`,
      subtitle:
        "Linki is your go-to platform to turn<br/> your vision into reality. We connect<br/> you with top-class tech and design<br/> teams that will help you quickly test<br/> and validate ideas, build products<br/> and grow them to success.",
      searchText: "Let’s build something great",
      class: "text2",
    },
    {
      title: `<span>Give your idea</span><br/> the best chance<br/> of success`,
      subtitle:
        "Linki is your go-to platform to bring your vision to life.<br/> Get easily connected with top-class tech and design teams<br/> to take your idea from concept to successful completion.",
      searchText: "Let’s build something great",
      class: "text3",
    },
  ],

  usecasesSection: {
    beforeTitle: "How Linki works",
    title: "Start your project today",
    text: "Linki makes everything simple. Submit  your project and<br/> receive a fair quote. Choose the perfect team and kick<br/> off your project. With Linki, you can get everything done<br/> on time and within budget to a high standard.",
  },

  teamsSection: {
    title: "Hand-picked top-class teams",
  },

  partnersSection: {
    title: "Our teams worked with",
  },

  productsSection: {
    title: "Succesfully completed projects",
  },

  whySection: {
    banner: {
      title: "Find the<br/> dream team",
      subtitle:
        "We carefully review,\n interview, and personally\n invite each team,<br/> so you\n can rest assured your project\n is in the most capable hands.",
      beforeTitle: "For You",
      facts: [
        {
          id: 1,
          title: "One Solution",
          text: "Finding  the perfect team \nhas never been easier",
        },
        {
          id: 2,
          title: "One Team",
          text: "We only pick true masters\n of their craft",
        },
        {
          id: 3,
          title: "One Point Of Contact",
          text: "Each team is supported by\n a committed project manager",
        },
      ],
    },

    section: {
      title: "Accomplish anything you\n set out to do",
      facts: [
        {
          id: 1,
          title: "Quickly test\n and validate ideas",
          text: "Create a digital prototype or MVP before\n you make the commitment to build out\n the final product and spend a budget",
        },
        {
          id: 2,
          title: "Build a great\n product",
          text: "Start with a prototype and test it out with an MVP. Find the right product-market fit, then take it to the next level and scale up.",
        },
        {
          id: 3,
          title: "Tackle challenging projects",
          text: "Get the job done  on time and within budget\n without wasting time and money on a long\n hiring process.",
        },
      ],
      tags: "<span>⚹</span>Streamlined project execution <span>⚹</span>Dedicated project manager <span>⚹</span>Affordable and simple<br/> project-based pricing<br/> <span>⚹</span>Transparent up-front quotes</br> <span>⚹</span>Safe escrow payments",
    },
  },

  teamSection: {
    beforeTitle: "For Teams",
    title: "Get your team discovered",
    newCards: [
      {
        id: 23345212,
        title: "<span>High Quality</span><br /> Leads",
        subtitle: "Access to a diverse pool of purpose-\ndriven brands looking for exceptional\n tech and design teams",
        list: [
          "Join the platform early\n and get noticed",
          "Work with your \nclients directly",
          "Build trust and grow\nyour client base ",
        ],
        btnText: "Get Leads",
      },
      {
        id: 853135423,
        title: "<span>Dream</span><br /> Projects",
        subtitle:
          "Showcase your work and get\n a first-mover advantage on  the radically\n better platform to find great projects",
        list: [
          "Find the projects that match\n your skills and interests",
          "Create your own fair\n quotes",
          "Enjoy the best financial\n terms on the market",
        ],
        btnText: "Find Projects",
      },
      {
        id: 934928341,
        title: "<span>All-in-one</span><br /> Platform",
        subtitle:
          "Enjoy the seamless working process\n from start to finish. With Linki, everything\n is done in one single dashboard.",
        list: [
          "Get easy access\n to job boards",
          "Monitor the project\n progress",
          "Keep track of clients\n with our hassle-free CRM",
        ],
        btnText: "Join Now",
      },
    ],
    newFacts: [
      {
        id: 1,
        title: "01 Setup Your\n Team Account",
        text: "Apply to join Linki today. Register your team account on the platform\n and if it’s a good fit you’ll get a link to your team profile. ",
      },
      {
        id: 2,
        title: "02 Build Your\n Team Profile",
        text: "Make your creative profile stand out with a beautiful showcase of your\n work, a clear description of your style, and helpful pricing details.",
      },
      {
        id: 3,
        title: "03 Get Noticed \nAnd Start a Project",
        text: "Open the door to more clients you’d love to work with, more\n high-value projects you’ll brag about",
      },
    ],
  },

  expertSection: {
    subtitle:
      "Linki provides great job opportunities<br/> for<br/> talented highly-skilled professionals.<br/> Join the platform and advance your career.",
    btntxt: "Apply to Join",
    facts: [
      "Work with top-notch tech\n and design teams",
      "Be a  part of exciting projects and\n create something truly remarkable",
      "Grow your income and never\n pay large comissions again",
    ],
  },

  footer: {
    title: "Join Linki today ",
    subtitle: "Empowering people to turn their amazing<br/> ideas into reality is what we're all about",
    footerSentence: "Execution\n is everything.\n It takes a right\n team to win.",
  },
}

const Main: NextPage = () => {
  return (
    <>
      <PageHead
        title={"Linki - platform for freelance"}
        description={
          "Join Linki - the unique platform connecting customers, experts and project managers of various fields across the world. Launch your own project or join the perfect team"
        }
      />
      <div className="wrapper sticky">
        <Header mainpage={true} large={true} />
        <main className="mainpage">
          <QuikStart newmain={true} sectionData={newText.quikstartSection[0]} withoutForm={true} />
          <UseCases sectionData={newText.usecasesSection} />
          <AreasSection />
          <TeamsSection sectionData={newText.teamsSection} />
          <OurPartnersSection sectionData={newText.partnersSection} />
          <ProductsSection sectionData={newText.productsSection} />
          <WhyLinki sectionData={newText.whySection} />
          <ForTeamSection sectionData={newText.teamSection} />
          <ForExpertSection sectionData={newText.expertSection} />
        </main>
        <FooterLarge sectionData={newText.footer} />
      </div>
    </>
  )
}

export default Main

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res }) => {
  const token = getCookie(USER_TOKEN_COOKIE, { req, res })

  if (token) {
    const { data: userData } = await store.dispatch(authApi.endpoints.checkToken.initiate(token))

    if (!userData) {
      removeCookies(USER_TOKEN_COOKIE, { req, res, sameSite: "lax" })
      return {
        props: {},
      }
    }

    const isVerified = userData.data.is_verified

    return {
      redirect: {
        destination: isVerified ? "/dashboard" : "/auth/email-verification",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
})
