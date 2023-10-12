import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "redux/store"

export interface OnboardingState {
  highlightArchive: boolean
  //client
  mountCreateProjectOnboarding: boolean
  startCreateProjectOnboarding: boolean
  clientCreateProject: {
    projectName: boolean
    projecеtDescription: boolean
    projecеtCover: boolean
    projecеtDirection: boolean
    projecеtCategories: boolean
    projecеtMedia: boolean
  }
  mountClientProjectsOnboarding: boolean
  startClientProjectstOnboarding: boolean
  clientProjectOnboardingAddInbound: boolean
  clientProjectOnboardingСonsideration: boolean
  clientProjectOnboardingReady: boolean
  clientProjectOnboardingReadyForWorkTab: boolean
  clientProjectOnboardingReadyForWorkTabStart: boolean
  clientProjectOnboardingCompletedkTab: boolean
  clientProjectOnboardingCompletedkTabStart: boolean

  //expert
  mountExpertProjectsOnboarding: boolean
  startExpertProjectstOnboarding: boolean
  expertProjectOnboardingAddInbound: boolean
  expertProjectOnboardingСonsideration: boolean
  expertProjectOnboardingСonsiderationChat: boolean
  expertProjectOnboardingReadyForWork: boolean

  mountExpertProjectsAtWorkOnboarding: boolean
  startExpertProjectsAtWorktOnboarding: boolean
  expertProjectOnboardingCompletedkTab: boolean

  //pm
  mountPmProjectsOnboarding: boolean
  startPmProjectsOnboarding: boolean
  pmProjectOnboardingAddInbound: boolean
  pmProjectOnboardingСonsideration: boolean
  pmProjectOnboardingСonsiderationOffer: boolean
  pmProjectOnboardingReadyForWork: boolean
  pmProjectOnboardingReadyForWorkStart: boolean
  mountPmProjectsAtWorkOnboarding: boolean
  startPmProjectsAtWorkOnboarding: boolean
  teamPmProjectsAtWorkOnboarding: boolean
  teamOpenPmProjectsAtWorkOnboarding: boolean
  fakeBoardPmProjectsAtWorkOnboarding: boolean
  pmProjectAtWorkOnboardingAddInbound: boolean
  pmProjectAtWorkOnboardingСonsideration: boolean
  pmProjectAtWorkOnboardingReadyForWork: boolean
  teamSelectedPmProjectsAtWorkOnboarding: boolean
  pmProjectOnboardingReadyForWorkTabStart: boolean
  pmProjectOnboardingCompletedTab: boolean
}

const initialState: OnboardingState = {
  highlightArchive: false,
  mountCreateProjectOnboarding: false,
  startCreateProjectOnboarding: false,
  clientCreateProject: {
    projectName: false,
    projecеtDescription: false,
    projecеtCover: false,
    projecеtDirection: false,
    projecеtCategories: false,
    projecеtMedia: false,
  },
  mountClientProjectsOnboarding: false,
  startClientProjectstOnboarding: false,
  clientProjectOnboardingAddInbound: false,
  clientProjectOnboardingСonsideration: false,
  clientProjectOnboardingReady: false,
  clientProjectOnboardingReadyForWorkTab: false,
  clientProjectOnboardingReadyForWorkTabStart: false,
  clientProjectOnboardingCompletedkTab: false,
  clientProjectOnboardingCompletedkTabStart: false,

  //expert
  mountExpertProjectsOnboarding: false,
  startExpertProjectstOnboarding: false,
  expertProjectOnboardingAddInbound: false,
  expertProjectOnboardingСonsideration: false,
  expertProjectOnboardingСonsiderationChat: false,
  expertProjectOnboardingReadyForWork: false,

  mountExpertProjectsAtWorkOnboarding: false,
  startExpertProjectsAtWorktOnboarding: false,
  expertProjectOnboardingCompletedkTab: false,

  //pm
  mountPmProjectsOnboarding: false,
  startPmProjectsOnboarding: false,
  pmProjectOnboardingAddInbound: false,
  pmProjectOnboardingСonsideration: false,
  pmProjectOnboardingСonsiderationOffer: false,
  pmProjectOnboardingReadyForWork: false,
  pmProjectOnboardingReadyForWorkStart: false,
  mountPmProjectsAtWorkOnboarding: false,
  startPmProjectsAtWorkOnboarding: false,
  teamPmProjectsAtWorkOnboarding: false,
  teamOpenPmProjectsAtWorkOnboarding: false,
  fakeBoardPmProjectsAtWorkOnboarding: false,
  pmProjectAtWorkOnboardingAddInbound: false,
  pmProjectAtWorkOnboardingСonsideration: false,
  pmProjectAtWorkOnboardingReadyForWork: false,
  teamSelectedPmProjectsAtWorkOnboarding: false,
  pmProjectOnboardingReadyForWorkTabStart: false,
  pmProjectOnboardingCompletedTab: false,
}

type Updater<T, K extends keyof T = keyof T> = {
  [P in K]: {
    field: P
    data: T[P]
  }
}[K]

export const onboardingSlice = createSlice({
  name: "onboardingRedux",
  initialState,
  reducers: {
    resetonbOardingRedux: (state: OnboardingState, { payload }: PayloadAction<keyof OnboardingState | "all">) => {
      if (payload === "all") return initialState
      // @ts-ignore
      state[payload] = initialState[payload]
    },
    updateOnboardingRedux: (
      state: OnboardingState,
      { payload: { field, data } }: PayloadAction<Updater<OnboardingState>>
    ) => {
      // @ts-ignore
      state[field] = data
    },
    updateClientCreateProject: (state: OnboardingState, { payload: { field, data } }) => {
      state.clientCreateProject[field] = data
    },
  },
})

export const { updateOnboardingRedux, resetonbOardingRedux, updateClientCreateProject } = onboardingSlice.actions
export const selectonboardingRedux = (state: RootState) => state[onboardingSlice.name]
