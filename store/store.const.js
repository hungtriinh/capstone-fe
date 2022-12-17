// index
export const INDEX_SET_SUCCESS = 'setNotifySuccess'
export const INDEX_SET_ERROR = 'setNotifyError'
export const INDEX_SET_WARNING = 'setNotifyWarning'
export const INDEX_SET_LOADING = 'setLoading'
export const INDEX_SET_LIST_FRIEND = 'setListFriends'
export const INDEX_SET_ROLE_MEMBER = 'setRoleMember'
export const MASTER_GET_DATA = 'getMasterData'
export const UPLOAD_FILE = 'uploadFile'
export const SET_EMAIL = 'setEmail'
export const SET_IS_OPT_PAGE = 'setIsOtpPage'
export const LENGTH_CODE_OTP = 6
export const OTP_EXPIRE = 20
export const AUTH_REGISTER = 'authentication/register'
export const AUTH_RESEND_OTP = 'authentication/reSendOtp'
export const AUTH_VERIFY_REGISTER_OTP = 'authentication/verifyRegisterOtp'
export const AUTH_LOGOUT = 'authentication/logout'
export const AUTH_LOGIN = 'login'
export const AUTH_SEND_OTP = 'sendOtp'
export const AUTH_CHECK_OTP = 'checkOtp'
export const AUTH_SIGNUP = 'signup'

// constants
export const AUTH_SET_ROLES = 'authentication/setRoles'
export const AUTH_SET_PERMISSIONS = 'authentication/setPermissions'
export const AUTH_SEND_EMAIL_FORGOT = 'authentication/sendEmailForgot'
export const AUTH_RESET_PASS = 'authentication/resetPass'
export const AUTH_CHECK_TOKEN = 'authentication/checkToken'
export const CHANGE_PASS = 'authentication/changePass'

export const TYPE_LOGIN_OTP = 1
export const TYPE_REGISTER_OTP = 2

export const GET_EVENT_LIST = 'getEventList'
export const GET_EVENT_DETAIL = 'getEventDetail'
export const GET_FRIEND_LIST = 'getFriendList'
export const CREATE_EVENT = 'createEvent'

// receipt
export const GET_RECEIPT_LIST = 'getReceiptList'
export const GET_MEMBER_LIST = 'getMemberList'
export const CREATE_RECEIPT = 'createReceipt'
export const RECEIPT_DETAIL = 'getReceiptDetail'
export const RECEIPT_ACCEPT = 'acceptReceipt'
export const RECEIPT_WAITING = 'getListReceiptWaiting'

// debt
export const GET_DEBT_LIST = 'getDebtList'
export const PAY_DEBT = 'payDebt'
export const DEBT_SENT_LIST = 'getDebtSent'
export const GET_PAID_CODE = 'getDebtCode'
export const DEBT_GET_DETAIL = 'getDebtDetail'
export const DEBT_GET_ALL_DEBT = 'getAllDebt'
export const DEBT_GET_ALL_RECEIPT = 'getAllReceipt'
export const DEBT_CLICK_I = 'clickIbutton'
export const DEBT_REMIND = 'clickRemind'
export const PAID_WAITING = 'getPaidRequest'
export const PAID_ACCEPT = 'acceptPaid'
export const GET_PAID_HANDLE = 'getPaidHandle'

// join request
export const GET_REQUEST_WAITING = 'getRequestWaiting'
export const GET_REQUEST_HISTORY = 'getRequestHistory'
export const REQUEST_APPROVE = 'approveRequest'

// list-document
export const GET_LIST_DOCUMENT = 'getListDocument'
export const GET_RECEIPT_HANDLE = 'getReceiptHandle'

// event
export const GET_SHARE_LINK = 'getShareLink'
export const EVENT_CLOSE = 'closeEvent'
export const EVENT_EDIT = 'editEvent'
export const EVENT_SEARCH = 'searchEvent'
export const EVENT_INTRODUCE = 'getEventIntroduce'

// member
export const MEMBER_GET_ALL = 'getAllMember'
export const PROMOTE_GET_ALL = 'getlistPromote'
export const MEMBER_REMOVE = 'removeMember'
export const MEMBER_PROMOTE = 'promoteMember'
export const MEMBER_ROLE_REMOVE = 'removeRoleMember'

// up anh
export const IMAGE_UPLOAD_RECEIPT = 'uploadReceipt'
export const IMAGE_UPLOAD_DEBT = 'uploadDebt'

// report
export const REPORT_GET_LIST = 'getListReport'
export const REPORT_GET_LIST_HISTORY = 'getListReportHistory'
export const REPORT_APPROVE = 'approveReport'
export const REPORT_CREATE = 'createReport'

// activity

export const ACTIVITY_GET = 'getActivity'
export const PROFILE_GET = 'getProfile'
export const PROFILE_UPDATE = 'updateProfile'

// check-join
export const EVENT_CHECK_JOIN = 'checkJoinEvent'
export const EVENT_JOIN_REQUEST = 'eventRequest'
export const EVENT_REQUEST_SENT = 'sentRequest'

// friend
export const FRIEND_LIST = 'getListFriend'
export const FRIEND_LIST_REQUEST = 'getListFriendRequest'
export const FRIEND_SEND_REQUEST = 'sendFriendRequest'
export const FRIEND_DELETE_REQUEST = 'deleteFriendRequest'
export const FRIEND_RESPONSE_REQUEST = 'responseFriendRequest'
export const FRIEND_SEARCH = 'searchFriend'
export const FRIEND_SEARCH_LIST = 'searchListFriend'
export const FRIEND_SEND = 'sendFriend'
export const FRIEND_COUNT = 'countFriend'

// faq
export const FAQ_LIST = 'getFAQ'

// group
export const GROUP_REQUEST = 'getGroupRequest'
export const GROUP_INVITED = 'getGroupInvited'
export const GROUP_APPROVE = 'approveGroup'
