const { default: axios } = require("axios")


const ResultApi = async (req,res)=> {
        const {transactionId} = req.body
    try {
        const result =await axios.post(`https://ind.idv.hyperverge.co/v1/link-kyc/results`,
            {
                transactionId
            },
            {
                headers :{
                    'Content-Type':'application/json',
                    'appid':process.env.appid,
                    'appkey':process.env.appkey
                }
            }
    )

    res.status(200).json({
        success:true,
        message:'Successfully fetch the result api',
        data :result.data
    })


    } catch(e) {
        console.error('Error occured while calling webhook api',e)
    }

}

module.exports = {
    ResultApi
}