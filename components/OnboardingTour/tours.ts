//STEPS FOR TOURS
export const TOUR_STEPS_CLIENT_Projects = [
  {
    target: ".tour-client-prj-tabslinear",
    title: "Main tabs of the section",
    content:
      "We are glad that you decided to explore the service in more detail. So, in the section My Projects you have access to 3 tabs:<br> <b>Responses</b> — incoming responses; <br> <b>At work</b> — projects in progress;<br> <b>Completed</b> — completed projects;<br> <b>Draft</b> — project drafts. Let's start with the <b>Responses tab</b>",
    disableBeacon: true,
  },
  {
    target: ".tour-customer-project-card",
    title: "Congratulations, you created your first project!",
    content:
      "All created projects will be displayed in the form of cards that contain brief information about the project, the number of responses and message notifications",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-board",
    title: "Each project has boards to work with project managers who have responded",
    content: "You have three columns that carry different functions",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    title: "Inbound column",
    content: "Here will be displayed all cards with PMs who responded",
    disableBeacon: true,
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Information about the PM",
    content:
      "Each card contains information about the PM, which will allow you to select the right candidate for better implementation of your project",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-inbound-col",
    content: "For convenient sorting of incoming responses you can remove unnecessary cards to the archive",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    content: "You can quickly access the archive and return to the initial state of inbound requests",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    content:
      "Now that you have examined the interested PMs, you can move to the second column those with whom you are ready to continue discussing the project",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    title: "You can move the card to the second column in 2 ways: ",
    content: "<p>1. Drag and drop the card manually</p><span>2. Use the button in the pop up window</span>",
    disableBeacon: true,
  },
  {
    target: ".tour-mp-fake-modal",
    title: "You can move the card to the second column in 2 ways: ",
    content: "1. Drag and drop the card manually<p>2. Use the button in the pop up window</p>",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-under-consider-col",
    content:
      "This column is where the main communication and discussion of project details take place. The PM will check with you all the necessary information and form the offer with an estimate of the project.<br></br> It will take some time to prepare an offer, and once the offer is ready, you will receive it.",
    disableBeacon: true,
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Viewing an offer from PM",
    content:
      "The offer is a summary of the project, which includes: terms of reference, a list of project participants, the sum and timing of the project",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-ready-for-wrok-col",
    title: "Ready for work column",
    content:
      "After selecting suitable offers, you can drag one or more cards into this column. The start of work begins when you click 'Start a safe deal' and pay for the project.",
    disableBeacon: true,
  },
]

export const TOUR_STEPS_CLIENT_Projects_AT_WORK = [
  {
    target: ".tour-customer-project-at-work-card",
    title: "Task card at work",
    content: "The 'At Work' section will display the projects on which work has already started",
    disableBeacon: true,
    placement: "right",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Viewing the project card",
    content:
      "In this card, you can view detailed information about the project, as well as track the process of work on the project and communicate with the PM",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-customer-project-at-work-card",
    title: "Task card at work",
    content:
      "After the PM from his side presses the button to complete the project, you will have the opportunity to check and pay for it",
    disableBeacon: true,
    placement: "right",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "PM's quality assessment",
    content: "Evaluate the quality of the PM's work on your project before submitting payment. ",
    disableBeacon: true,
    placement: "left",
  },
]

export const TOUR_STEPS_CLIENT_Projects_COMPLETED = [
  {
    target: ".tour-customer-project-at-work-card",
    title: "Card with a completed project",
    content:
      "After payment and evaluation of the project, the card will move to the section 'Completed', which will store all your projects history of chats/works/materials/...",
    disableBeacon: true,
    placement: "right",
  },
]
//EXPERTS TOURS STEPS
export const TOUR_STEPS_EXPERT_Projects = [
  {
    target: ".tour-expert-prj-tabslinear",
    title: "Main tabs of the section",
    content:
      "We are glad that you decided to explore the service in more detail. So, in the section My Projects you have access to 3 tabs:<br> <b>Incoming</b> — incoming projects;<br> <b>At work</b> — projects in progress;<br> <b>Completed</b> — completed projects. Let's start with the <b>Incoming tab</b>",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: ".tour-sortable-board",
    title: "All of the projects you can participate in are placed on the boards",
    content: "Each board determines the stage of approval of participation in the project",
    disableBeacon: true,
  },
  {
    target: ".tour-projects-filter",
    title: "For a quick search you can use the filter",
    content:
      "The filter allows to quickly sort the incoming offers by different parameters, such as category or publication date",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    title: "Inbound column",
    content: "This column shows the projects in which you can participate",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Information about the project",
    content: "The project card contains a full description of the project and additional information",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-inbound-col",
    content:
      "If you don't want to participate in the project, just send it to the  archive, and the project card will disappear from the board",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    content: "At any moment you can view your archived project cards and get them back to work",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    content:
      "Now that you have examined the incoming projects, you can move to the second column those projects that you are ready to work on",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-under-consider-col",
    title: "Under consideration column",
    content:
      "By moving the card to the second column, you are responding to participate in the project and showing the PM that you are ready to discuss details",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-under-consider-col",
    content:
      "When a PM selects you as a candidate for a job, you will be able to communicate in a chat to clarify the details of the project",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-under-consider-col",
    content:
      "If you have decided that you are ready to participate in the project, you can move the project card to the third column",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-ready-for-wrok-col",
    title: "Ready for work column",
    content:
      "When you move the project card to this column, you agree to participate in the project. When the PM selects you as the performer, the project card will be moved to the At work section.",
    disableBeacon: true,
    placement: "top",
  },
]

export const TOUR_STEPS_EXPERT_Projects_AT_WORK = [
  {
    target: ".tour-customer-project-at-work-card",
    title: "Project card at work",
    content: "The At Work section will display the projects you have in progress.",
    disableBeacon: true,
    placement: "right",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Viewing the project card",
    content:
      "Here you can find detailed information about the project! Terms of Reference, project team, project progress status and the ability to communicate with the PM and team",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Viewing the project card",
    content:
      "After completing the job, you need to submit the results to the PM and click Finish project.<br><br> After the client fully accepts the project, you will receive payment to your account.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Evaluation of team members",
    content:
      "After the project is completed, you evaluate all team members. This is the final step for receiving payment into your account",
    disableBeacon: true,
    placement: "left",
  },
]
export const TOUR_STEPS_EXPERT_Projects_COMPLETED = [
  {
    target: ".tour-customer-project-at-work-card",
    title: "Card with a completed project",
    content:
      "After you receive payment for your project, the project card moves to Completed. Here you can find the needed person from the team or just recall an interesting project",
    disableBeacon: true,
    placement: "right",
  },
]

//PM TOUR STEPS
export const TOUR_STEPS_PM_Projects = [
  {
    target: ".tour-expert-prj-tabslinear",
    title: "Main tabs of the section",
    content:
      "We are glad that you decided to explore the service in more detail. So, in the section My Projects you have access to 3 tabs:<br> <b>Incoming</b> — incoming projects;<br> <b>At work</b> — projects in progress;<br> <b>Completed</b> — completed projects. Let's start with the <b>Incoming tab</b>",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: ".tour-sortable-board",
    title: "All of the projects you can participate in are placed on the boards",
    content: "Each board determines the stage of approval of participation in the project",
    disableBeacon: true,
  },
  {
    target: ".tour-projects-filter",
    title: "For a quick search you can use the filter",
    content:
      "The filter allows to quickly sort the incoming offers by different parameters, such as category or publication date",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    title: "Inbound column",
    content: "This column shows the projects in which you can participate",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Information about the project",
    content: "The project card contains a full description of the project and additional information",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-inbound-col",
    content:
      "If you don't want to participate in the project, just send it to the  archive, and the project card will disappear from the board",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-inbound-col",
    content: "At any moment you can view your archived project cards and get them back to work",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-inbound-col",
    content:
      "Now that you have examined the incoming projects, you can move to the second column those projects that you are ready to work on",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-under-consider-col",
    title: "Under consideration column",
    content:
      "By moving the card to the second column, you are responding to participate in the project and showing the client that you are ready to discuss details",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-under-consider-col",
    content:
      "When a client selects you as a candidate, you will be able to make an offer or communicate with him/her in a chat to clarify details",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-sortable-under-consider-col",
    content: "In order to create an offer, click on the Edit offer on the card or in the project window",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Offer creation",
    content: "To create an offer, you need to fill in all the fields",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    content:
      "First, describe the end result of the project. This will help the client understand how accurately and correctly you understand the project essence and what the result will be at the end of the project.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    content: "Next, you need to add the roles of specialists who will participate in the project",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    content: "To do this, select the required category and profession of the performer",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    content:
      "Then, specify the specialist's hourly rate and the estimated time to complete the project by the specialist in that role.<br></br> You can do this manually or use the slider that shows the cost range of specialists with the selected role.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    content:
      "After specifying all the necessary specialist roles, you will see the total project budget, your income from the project, and the platform commission.<br></br> <p><b>To send an offer to the customer, click Send offer</b></p>",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-ready-for-wrok-col",
    title: "Ready for work column",
    content:
      "After you have sent an offer, your card is automatically moved to the third column, and you are waiting for your candidacy to be selected by the client",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-ready-for-wrok-col",
    content:
      "When a client selects you as a performer, you confirm your participation with the Start project button and take the project to work",
    disableBeacon: true,
    placement: "left",
  },
]

export const TOUR_STEPS_PM_PROJECTS_AT_WORK = [
  {
    target: ".tour-customer-project-at-work-card",
    title: "Project card at work",
    content:
      "The At Work section will display the projects you have in progress.<br></br> To get started, you must adjust the terms of reference for each performer and begin searching for team members. <p><b>To continue, choose the project card.</b></p>",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Terms of reference",
    content:
      "Before creating a team, describe the terms of reference for the project so that performers correctly understand their tasks in the project",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-fake-projects-team",
    title: "My team",
    content:
      "After filling out the terms of reference for performers, you will see cards with the roles that you defined at the stage of the offer",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-fake-projects-team",
    content:
      "You can select a performer for a particular role in three ways:<br> <b>Post a job</b> — publish for all;<br> <b>Add from Favorites</b>  — add from favorites;<br> <b>Share link</b> — invite from the outside. Let's consider the option Post a job",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-board",
    title: "Congratulations, you have posted an opening for a role in the project!",
    content:
      "All candidates for the role are placed on boards. Each board determines the stage of selection for the role in the project.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-inbound-col",
    title: "Inbound column",
    content: "This column shows the projects in which you can participate",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-inbound-col",
    content: "You can move candidate cards to the archive by analogy with<br>project cards",
    disableBeacon: true,
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Performer profile",
    content:
      "By clicking on a performer's card, you can see detailed information about him/her and make a decision about cooperation.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-sortable-under-consider-col",
    title: "Under consideration column",
    content:
      "By moving the specialist's card to the second column, you get the opportunity to chat with him/her to discuss project details and terms of cooperation",
    disableBeacon: true,
  },
  {
    target: ".tour-sortable-ready-for-wrok-col",
    title: "Ready for work column",
    content:
      "In this column, you gather the candidates that you are ready to take on the project. Click Get started to make your final selection",
    disableBeacon: true,
  },
  {
    target: ".tour-fake-projects-team",
    title: "Performer's card",
    content: "After the performer confirms his/her participation, he/she joins the project team",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Information about the project",
    content:
      "At any time you can communicate with the client and the team, as well as monitor the main stages of the project",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    content:
      "When the project is done or the project deadline comes to an end, you can check the achievement of the goal and send the result to the client for review.<br></br> Once the project is accepted, payment will be transferred to your account.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-mp-fake-modal",
    title: "Client and team evaluation ",
    content:
      "After the project is completed, you evaluate all team members and the client. This is the final step for receiving payment into your account",
    disableBeacon: true,
    placement: "left",
  },
]

export const TOUR_STEPS_PM_PROJECTS_COMPLETED = [
  {
    target: ".tour-customer-project-at-work-card",
    title: "Card with a completed project",
    content:
      "After you receive payment for your project, the project card moves to Completed. Here you can find the needed person from the team, a favourite client, or just recall an interesting project",
    disableBeacon: true,
    placement: "right",
  },
]

//DASHBOARD STEPS
export const TOUR_DASHBOARD_EXPERT = [
  {
    target: ".tour-stat-block",
    content:
      "Here you will see your statistics on the platform: rating, incoming and completed projects, as well as how much you've earned in a month",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-myprojects",
    content: "Here you can respond to new projects and interact with the team on ongoing projects",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-wallet",
    content:
      "Here you will find information about the balance of your wallet and the operations you can perform with it",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-profile-info",
    content:
      "Here the level of your profile completion is displayed. Fill out your profile completely and you will be able to participate in exciting projects as part of awesome teams!",
    disableBeacon: true,
    placement: "top",
  },
]
export const TOUR_DASHBOARD_CUSTOMER = [
  {
    target: ".tour-welcome-block",
    content: "Here you can start creating your project",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-welcome-block",
    content: "If you have difficulty with the project creation, you can contact our manager for help",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-stat-block",
    content:
      "Here you will see your statistics on the platform: rating, number of projects and specialists involved, as well as the total budget of your projects",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-myprojects",
    content: "Here you can select PMs for new projects and interact with PMs on ongoing projects",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-wallet",
    content:
      "Here you will find information about the balance of your wallet and the operations you can perform with it",
    disableBeacon: true,
  },
  {
    target: ".tour-profile-info",
    content:
      "Here the level of your profile completion is displayed. Fill out your profile completely to attract attention of more PMs to your projects",
    disableBeacon: true,
  },
]
export const TOUR_DASHBOARD_PM = [
  {
    target: ".tour-stat-block",
    content:
      "Here you will see your statistics on the platform: rating, incoming and completed projects, as well as how much you've earned in a month",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-myprojects",
    content: "Here you will see projects that suit you and projects you have in progress",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-wallet",
    content:
      "Here you will find information about the balance of your wallet and the operations you can perform with it",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".tour-profile-info",
    content:
      "Here the level of your profile completion is displayed. Fill out your profile completely to attract more clients and talents",
    disableBeacon: true,
    placement: "top",
  },
]
