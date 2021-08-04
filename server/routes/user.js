const express = require("express");
const router = express.Router();
const userFunctions =require('./userFunctions');
const Twitter = require(`../social_media_sites/Twitter`);
const twitter = new Twitter().getInstance();

router.post("/get4chanPost", async (request,response)=>{
    const email = request.body.email;
    if(!email || !(typeof email === 'string' || email instanceof String))
        return response.status(401).json({status: `Bad Request`, error: `Malformed request. Please check your parameters`});
    userFunctions.get4chanPost().then( tweets => {
        return response.status(200).json(tweets);
    }).catch(err=>{
        return response(401).json({status:`error`, error: err})
    })
});

router.post("/getRedditPost", async (request,response)=>{
    if(request.body.email === null)
        return response.status(401).json({status: `error`, error: `Malformed request. Please check your parameters`});
    else{
        userFunctions.getRedditPost(request.body.email).then(data=>{
            response.status(200).json(data);
        }).catch(err=>{
            return response(401).json({status:`error`, error: err})
        })
    }
});

router.post("/coinRedditPost", async (request,response)=>{
    // console.log(request.body.email);
    // console.log(request.body.coin);

    if(request.body.email === null || request.body.coin === null)
        return response.status(401).json({status: `error`, error: `Malformed request. Please check your parameters`});
    else{
        userFunctions.coinRedditPost(request.body.coin).then(data=>{
            response.status(200).json(data);
        }).catch(err=>{
            return response(401).json({status:`error`, error: err})
        })
    }
});

/** This function gets the cryptos a user is following
 * @param {object} request A request object with the email and symbol.
 * @param {object} response A response object which will return the status code.
 * @return          A status code stating if the request was successful.
 * */
router.post("/getUserCryptos", async (request, response) => {
     if(!request.body.email)
         return response.status(401).json({status: `error`, error: `Malformed request. Please check your parameters`});
     else {
          userFunctions.getUserCrypto(request.body.email).then(data=>{
             return response.status(200).json(data);
         }).catch(err=>{
             return response(401).json({status:`error`, error: err})
         })
     }
 });

//testcode
router.post("/getUserSubreddits", async (request, response) => {
    if(!request.body.email)
        return response.status(401).json({status: `error`, error: `Malformed request. Please check your parameters`});
    else {
        userFunctions.getUserSubreddits(request.body.email).then(data=>{
            return response.status(200).json(data);
        }).catch(err=>{
            return response(401).json({status:`error`, error: err})
        })
    }
});

/** This function adds a social media site to the users account
 * @param {object} request A request object with the email and symbol.
 * @param {object} response A response object which will return the status code.
 * @return          A status code stating if the request was successful.
 * */
router.post("/followCrypto", async (request,response)=>{

    if(request.body.email === null || request.body.symbol === null || request.body.crypto_name === null)
        return response.status(401).json({status: `Bad Request`, error: `Malformed request. Please check your parameters`});
    else{
        await userFunctions.followCrypto(request.body.email,request.body.symbol,request.body.crypto_name).then(data=>{
            twitter.getTimeline(request.body.email).catch(err => response.status(500).json({status:`Internal server error`, error: err}));
            return response.status(200).json(data);
        }).catch(err=>{
            return response.status(500).json({status:`Internal server error`, error: err})
        });
    }
});

router.post("/unfollowCrypto", async (request,response, next)=>{

    if(request.body.email === null || request.body.symbol === null){
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
        await userFunctions.unfollowCrypto(request.body.email,request.body.symbol).then(data=>{
            return response.status(200).json(data);
        }).catch(err=>{
            let error = new Error(err);
            error.status = 500;
            return next(error);
        });
    }
});

router.post("/unfollowSubreddit", async (request,response, next)=>{
    if(request.body.email === null || request.body.subreddit === null){
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
        await userFunctions.unfollowSubreddit(request.body.email,request.body.subreddit).then(data=>{
            return response.status(200).json(data);
        }).catch(err=>{
            let error = new Error(err);
            error.status = 500;
            return next(error);
        });
    }
});

/** This function adds a social media site to the users account
 * @param {object} request A request object with the email and social_media_sites.
 * @param {object} response A response object which will return the status code.
 * @return          A status code stating if the request was successful.
 * */
router.post("/followSocialMedia",async (request,response, next)=>{
    if(!request.body.email || !request.body.social_media_sites){
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
          await userFunctions.followSocialMedia(request.body.email,request.body.social_media_sites).then(data=>{
              response.status(200).json(data);
          }).catch(err=>{
              let error = new Error(err);
              error.status = 500;
              return next(error);
          })
        }
});

router.post("/unfollowSocialMedia", async (request,response, next)=>{

    if(!request.body.email || !request.body.social_media_sites){
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
        await userFunctions.unfollowSocialMedia(request.body.email,request.body.social_media_sites).then(data=>{
            return response.status(200).json(data);
        }).catch(err=>{
            let error = new Error(err);
            error.status = 500;
            return next(error);
        });
    }
});


/** This function gets the social media a user is following
 * @param {object} request A request object with the email and symbol.
 * @param {object} response A response object which will return the status code.
 * @return          A status code stating if the request was successful.
 * */
router.post("/fetchUserSocialMedia", async (request, response, next) => {
    if(request.body.email === null) {
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
        userFunctions.fetchUserSocialMedia(request.body.email).then(data=>{
            return response.status(200).json(data);
        }).catch(err=>{
            let error = new Error(err);
            error.status = 500;
            return next(error);
        })
    }
});

router.post("/fetchUserSubreddits", async (request, response, next) => {

    if(request.body.email === null) {
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
        userFunctions.fetchUserSubreddits(request.body.email).then(data=>{
            return response.status(200).json(data);
        }).catch(err=>{
            let error = new Error(err);
            error.status = 500;
            return next(error);
        })
    }
});

//this is the functions
router.post("/followSubreddit",async (request,response, next)=>{
    if(!request.body.email || !request.body.social_media_sites){
        let error = new Error(`Malformed request. Please check your parameters`);
        error.status = 400;
        return next(error);
    }
    else{
        await userFunctions.followSubreddit(request.body.email,request.body.social_media_sites).then(data=>{
            response.status(200).json(data);
        }).catch(err=>{
            let error = new Error(err);
            error.status = 500;
            return next(error);
        })
    }
});

module.exports = router
