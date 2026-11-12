// Frame file -> app route. State frames resolve to the route plus a ?state= query used by the visual audit.
export const ROUTES = {
  V9Splash: '/', V9Welcome: '/welcome', V9SafeSpace: '/safe-space', V9DataUse: '/data-use',
  V9SignIn: '/sign-in', V9SignInError: '/sign-in?state=error', V9SignUp: '/sign-up', V9SignUpError: '/sign-up?state=error',
  V9Verify: '/verify', V9VerifyOTP: '/verify?state=otp', V9VerifyFetching: '/verify?state=fetching', V9VerifyDone: '/verify?state=done',
  V9Home: '/home', V9HomeDone: '/home?state=done', V9HomeLoading: '/home?state=loading', V9HomeOffline: '/home?state=offline',
  V9HomePulling: '/home?state=pulling', V9HomeRefreshing: '/home?state=refreshing', V9HomeMissed: '/home?state=missed',
  V9Analysis: '/analysis', V9AnalysisCollapsed: '/analysis?state=collapsed',
  V9Recovery: '/recovery', V9Phase1: '/recovery/phase/1', V9Phase2: '/recovery/phase/2', V9Phase3: '/recovery/phase/3',
  V9PhaseComplete: '/recovery/phase-complete',
  V9Actions: '/actions', V9ActionsLoans: '/actions?view=loans', V9ActionsEmpty: '/actions?view=empty',
  V9SheetPay: '/actions?sheet=pay', V9PaySheetHolding: '/actions?sheet=pay&stage=holding', V9PaySheetReleased: '/actions?sheet=pay&stage=released',
  V9SheetPayProcessing: '/actions?sheet=pay&stage=processing', V9SheetPayFailed: '/actions?sheet=pay&stage=failed', V9SheetPaySuccess: '/actions?sheet=pay&stage=success',
  V9SheetAutopay: '/actions?sheet=autopay', V9SheetUpload: '/actions?sheet=upload', V9SheetUploadProgress: '/actions?sheet=upload&stage=uploading',
  V9SheetUploadError: '/actions?sheet=upload&stage=uploadError', V9SheetDispute: '/actions?sheet=dispute', V9SheetDisputeSubmitted: '/actions?sheet=dispute&stage=submitted',
  V9ToastError: '/actions?stage=toastError',
  V9Learn: '/learn', V9LearnLoading: '/learn?state=loading', V9LearnEmpty: '/learn?state=empty',
  V9ArticleScore: '/learn/how-credit-scores-work', V9ArticleMin: '/learn/minimum-payments', V9ArticleStrategy: '/learn/snowball-vs-avalanche',
  V9ArticleDisputes: '/learn/disputing-errors', V9ArticleUtilisation: '/learn/utilisation',
  V9Profile: '/profile', V9PersonalInfo: '/profile/personal-info', V9PersonalInfoError: '/profile/personal-info?state=error',
  V9Privacy: '/profile/privacy', V9DataPerms: '/profile/data-permissions', V9Notifications: '/profile/notifications',
  V9Help: '/profile/help', V9HelpSent: '/profile/help?state=sent',
};

// In-app links never carry the audit query, except the sheets, which are real app states.
export const linkFor = (frame) => {
  const sheets = { V9SheetPay: 'pay', V9SheetUpload: 'upload', V9SheetDispute: 'dispute', V9SheetAutopay: 'autopay' };
  if (sheets[frame]) return '/actions?sheet=' + sheets[frame];
  const r = ROUTES[frame];
  return r ? r.split('?')[0] : null;
};
