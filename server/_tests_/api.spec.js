const request = require('supertest');
const expect = require('chai').expect;
const app = require("../app");

describe('POST /', () => {
    test('responds with error message in json 404', done => {
        request(app)
            .post('/')
            .send({})
            .expect(404)
            .expect('Content-Type', /json/)
            .end((err,res) => {
                if(err) return done(err);
                expect(res.body.error.message).to.equal("Not found")
                return done();
            });
    });
});

describe('POST /user', () => {
    test('responds with error message in json 404', done => {
        request(app)
            .post('/user')
            .send({})
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err,res) => {
                if(err) return done(err);
                expect(res.body.error.message).to.equal("Not found")
                return done();
            });
    });
});

describe('POST /user/getUserTweets', () => {
    let email = "codexteam4@gmail.com";
    jest.setTimeout(100000);
    test(`Positive input. Returns 200`, done => {
        request(app)
            .post('/user/getUserTweets')
            .send({"email":email})
            .expect(200)
            .then(response => {
                expect(response.body.status).to.equal("Ok");
                expect(response.body.screen_names).to.be.a('array');
                expect(response.body.tweets_array).to.be.a('array');
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to give null values. Return 401`, done => {
        email = null;
        request(app)
            .post('/user/followCrypto')
            .send({"email":email})
            .expect(401)
            .then(response => {
                expect(response.body.status).to.equal(`Bad Request`);
                expect(response.body.error).to.equal(`Malformed request. Please check your parameters`);
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to give empty string. Returns 401`, done => {
        email = "";
        request(app)
            .post('/user/followCrypto')
            .send({"email":email})
            .expect(401)
            .then(response => {
                expect(response.body.status).to.equal(`Bad Request`);
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to give a different data type. Returns 401`, done => {
        email = 13;
        request(app)
            .post('/user/followCrypto')
            .send({"email":email})
            .expect(401)
            .then(response => {
                expect(response.body.status).to.equal(`Bad Request`);
                done();
            })
            .catch(err => done(err))
    });
});

describe('POST /user/analyse', () => {
    let crypto_name = "Bitcoin";
    let social_media_name = "Twitter";
    test('Positive input. returns status code 200', done => {
        request(app)
            .post('/user/analyse')
            .send({"crypto": crypto_name, "socialMedia": social_media_name})
            .expect(200)
            .expect('Content-Type', /json/)
            .end((res) => {
                return done();
            });
    });
    test('Tries to send an empty request. Returns status code 401', done => {
        crypto_name = null;
        social_media_name = null;
        request(app)
            .post('/user/analyse')
            .send({"crypto": crypto_name, "socialMedia": social_media_name})
            .expect(401)
            .expect('Content-Type', /json/)
            .end((response) => {
                done();
            });
    });
});

describe('POST /user/followCrypto', () => {
    let crypto = "Litecoin";
    let symbol = "ltc";
    let email = "codexteam4@gmail.com";
    jest.setTimeout(100000);
    test(`Adds a crypto for the user in the database`, done => {
        request(app)
            .post('/user/followCrypto')
            .send({"email":email, "crypto_name":crypto, "symbol":symbol})
            .expect(200)
            .then(response => {
                expect(response.body.status).to.equal("Ok");
                expect(response.body.message).to.equal("The crypto been successfully added")
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to add an existing crypto to the user in the database`, done => {
        request(app)
            .post('/user/followCrypto')
            .send({"email":email, "symbol": symbol, "crypto_name":crypto})
            .expect(202)
            .then(response => {
                expect(response.body.status).to.equal("Accepted");
                expect(response.body.message).to.equal("The cryptocurrency already exists");
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to add a crypto for a non-existent user in the database`, done => {
        email = "someother@example.co.za"
        request(app)
            .post('/user/followCrypto')
            .send({"email":email, "symbol": symbol, "crypto_name":crypto})
            .expect(403)
            .then(response => {
                expect(response.body.status).to.equal(`Not authorized`);
                expect(response.body.error).to.equal(`The user does not exist`);
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to send a request without any parameters`, done => {
        email = null;
        crypto = null;
        symbol = null;
        request(app)
            .post('/user/followCrypto')
            .send({"email":email, "symbol": symbol, "crypto_name":crypto})
            .expect(401)
            .then(response => {
                expect(response.body.status).to.equal(`Bad Request`);
                expect(response.body.error).to.equal(`Malformed request. Please check your parameters`);
                done();
            })
            .catch(err => done(err))
    });
});

describe('POST /user/followSocialMedia', () => {
    let email = "codexteam4@gmail.com";
    let social_media_sites = "twitter";
    jest.setTimeout(100000);
    test(`Adds a social media site for the user in the database`, done => {
        request(app)
            .post('/user/followSocialMedia')
            .send({"email":email, "social_media_sites": social_media_sites})
            .expect(200)
            .then(response => {
                expect(response.body.status).to.equal("Ok");
                expect(response.body.message).to.equal("The social media site has been successfully added")
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to add an existing social media site to the user in the database`, done => {
        request(app)
            .post('/user/followSocialMedia')
            .send({"email":email, "social_media_sites":social_media_sites})
            .expect(202)
            .then(response => {
                expect(response.body.status).to.equal("Accepted");
                expect(response.body.message).to.equal("The site already exists");
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to add a crypto for a non-existent user in the database`, done => {
        email = "someother@example.co.za"
        request(app)
            .post('/user/followSocialMedia')
            .send({"email":email, "social_media_site":social_media_sites})
            .expect(403)
            .then(response => {
                expect(response.body.status).to.equal(`Not authorized`);
                expect(response.body.error).to.equal(`The user does not exist`);
                done();
            })
            .catch(err => done(err))
    });
    test(`Tries to send a request without any parameters`, done => {
        email = null;
        social_media_sites = null;
        request(app)
            .post('/user/followSocialMedia')
            .send({"email":email, "social_media_site":social_media_sites})
            .expect(401)
            .then(response => {
                expect(response.body.status).to.equal(`Bad Request`);
                expect(response.body.error).to.equal(`Malformed request. Please check your parameters`);
                done();
            })
            .catch(err => done(err))
    });
});