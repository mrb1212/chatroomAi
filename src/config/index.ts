const dev = process.env.NODE_ENV !== 'production';

    
export const server = !dev ? 'http://localhost:3001' : 'https://keytex.ir';

export const test = `${server}/api/AUTHS`



// WALLET & TRANSACTION
export const WALLETS=`${server}/api/FMS/wallets/list`
export const TRANSACTIONS=`${server}/api/FMS/transactions/list`

export const Transactions_Endpoint = `${server}/api/FMS/transactions`
export const Wallets_Endpoint = `${server}/api/FMS/wallets`


// AUTHS
export const AUTHS = `${server}/api/AUTHS` 
export const AUTHS_OPT = `${server}/api/AUTHS/OTP`  
export const AUTHS_auth = `${server}/api/AUTHS/auth`
export const AUTHS_SAuth_IPGAuth =`${server}/api/AUTHS/SAuth/IPGAuth`
export const AUTHS_SAuth_RAuth = `${server}/api/AUTHS/SAuth/RAuth`

// HRS
export const HRS = `${server}/api/HRS`
export const HRS_USERS = `${server}/api/HRS/users`
export const HRS_REFERRAL = `${server}/api/HRS/referrals`

// IPGs
export const IPG = `${server}/api/IPG`
export const IPG_SHETAB = `${server}/api/IPG/shetab`    
export const IPG_SHETAB_VANDAR = `${server}/api/IPG/shetab/vandar`

// FMS 
export const FMS = `${server}/api/FMS`
export const FMS_Invoice = `${server}/api/FMS/invoices`
export const FMS_Discount = `${server}/api/FMS/discounts`


// IPG crypto
export const IPG_Crypto_Endpoints = `${server}/api/IPG/crypto` 

// luckyWheel
export const LW_Endpoint = `${server}/api/luckyWheel`

// fileManger 
export const FileManager_Endpoint = `${server}/api/fileManager`
export const FileManager_Upload_Endpoint = `${server}/api/fileManager/upload`
export const FileManager_Files_Endpoint = `${server}/api/fileManager/files`

//KYC
// email
export const KYC_Endpoint = `${server}/api/KYC`
export const KYC_Email_Endpoint = `${server}/api/KYC/email`

// service
// pcakges
export const Services_Packages_Endpoint = `${server}/api/services/packages`

// activePackages
export const Services_ActivePackages_Endpoint = `${server}/api/services/activePackages`

// signals
export const Services_Signal_endpoint = `${server}/api/signals`

// market
export const Market_Crypto_endpoint = `${server}/api/market/crypto`
// market - crypto
export const Market_Crypto_Watcher_endPoint = `${server}/api/market/crypto/watcher`



// // services
// export const SERVICES=`${server}/api/services/packages/list`;
// export const UPDATESERVICE=`${server}/api/services/packages/admin/update`;
// export const SERVICE=`${server}/api/services/packages/info`

// article
export const Articles_Endpoint = `${server}/api/articles`

export const Comments_Endpoint = `${server}/api/comments`

export const Stories_Endpoint = `${server}/api/stories` // main
export const Stories_Admin_Endpoint = `${server}/api/stories/admin` // admin


// portfolio
export const Portfolio_Endpoint = `${server}/api/portfolio`// main user
export const Portfolio_Admin_Endpoint = `${server}/api/portfolio/admin`//admin

// analysis
export const Analysis_Endpoint = `${server}/api/analysis`// main user
export const Analysis_Admin_Endpoint = `${server}/api/analysis/admin`//admin

// SM // selfManage

export const SM_Endpoint = `${server}/api/SM`// main user
export const SM_Admin_Endpoint = `${server}/api/SM/admin`//admin

// chat
export const Chat_Endpoint = `${server}/api/chat`
