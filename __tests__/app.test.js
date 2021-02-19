require('dotenv').config();

const {execSync}=require('child_process');

const fakeRequest=require('supertest');
const app=require('../lib/app');
const client=require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData=await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token=signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('returns jewelry', async () => {

      const expectation=[
        {
          "id": 1,
          "name": "ember",
          "description": "antique teacup piece set in .925 silver, silver chain included",
          "price": 60,
          "category": "necklace",
          "made_of_silver": true,
          "owner_id": 1
        },
        {
          "id": 2,
          "name": "imelda",
          "description": "antique teacup piece set in .925 silver, silver chain included",
          "price": 60,
          "category": "necklace",
          "made_of_silver": true,
          "owner_id": 1
        },
        {
          "id": 3,
          "name": "constantine",
          "description": "turquoise set in sterling silver on silver band",
          "price": 75,
          "category": "ring",
          "made_of_silver": true,
          "owner_id": 1
        },
        {
          "id": 4,
          "name": "mary",
          "description": "antique teacup peice set in .925 silver, silver chain included",
          "price": 60,
          "category": "necklace",
          "made_of_silver": true,
          "owner_id": 1
        },
        {
          "id": 5,
          "name": "esther",
          "description": "antique teacup piece set in .925 silver, silver chain included",
          "price": 60,
          "category": "necklace",
          "made_of_silver": true,
          "owner_id": 1
        },
        {
          "id": 6,
          "name": "dianna",
          "description": "antique teacup peice set in .925 silver, silver chain included",
          "price": 60,
          "category": "necklace",
          "made_of_silver": true,
          "owner_id": 1
        }

      ];

      const data=await fakeRequest(app)
        .get('/jewelry')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns a single jewelry item with matching id', async () => {

      const expectation=[
        {
          'id': 4,
          'name': 'mary',
          'description': 'antique teacup peice set in .925 silver, silver chain included',
          'price': 60,
          'category': 'necklace',
          'made_of_silver': true,
          'owner_id': 1
        }
      ];

      const data=await fakeRequest(app)
        .get('/jewelry/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});

