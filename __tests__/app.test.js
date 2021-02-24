require('dotenv').config();

const {execSync} = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('returns jewelry', async () => {

      const expectation = [
        {
          "id": 6,
          "name": "dianna",
          "image": "http://placekitten.com/g/200/300",
          "description": "antique teacup peice set in .925 silver, silver chain included",
          "price": 60,
          "category_id": 1,
          "made_of_silver": true,
          "owner_id": 1,
          "category": "necklace"
        },
        {
          "id": 5,
          "name": "esther",
          "image": "http://placekitten.com/g/200/300",
          "description": "antique teacup piece set in .925 silver, silver chain included",
          "price": 60,
          "category_id": 1,
          "made_of_silver": true,
          "owner_id": 1,
          "category": "necklace"
        },
        {
          "id": 4,
          "name": "mary",
          "image": "http://placekitten.com/g/200/300",
          "description": "antique teacup peice set in .925 silver, silver chain included",
          "price": 60,
          "category_id": 1,
          "made_of_silver": true,
          "owner_id": 1,
          "category": "necklace"
        },
        {
          "id": 2,
          "name": "imelda",
          "image": "http://placekitten.com/g/200/300",
          "description": "antique teacup piece set in .925 silver, silver chain included",
          "price": 60,
          "category_id": 1,
          "made_of_silver": true,
          "owner_id": 1,
          "category": "necklace"
        },
        {
          "id": 1,
          "name": "ember",
          "image": "http://placekitten.com/g/200/300",
          "description": "antique teacup piece set in .925 silver, silver chain included",
          "price": 60,
          "category_id": 1,
          "made_of_silver": true,
          "owner_id": 1,
          "category": "necklace"
        },
        {
          "id": 3,
          "name": "constantine",
          "image": "http://placekitten.com/g/200/300",
          "description": "turquoise set in sterling silver on silver band",
          "price": 75,
          "category_id": 2,
          "made_of_silver": true,
          "owner_id": 1,
          "category": 'ring',
        }
      ];

      const data = await fakeRequest(app)
        .get('/jewelry')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.arrayContaining(expectation));
    });


    test('returns a single jewelry item with matching id', async () => {

      const expectation =
      {
        "id": 4,
        "name": "mary",
        "image": "http://placekitten.com/g/200/300",
        "description": "antique teacup peice set in .925 silver, silver chain included",
        "price": 60,
        "category_id": 1,
        "made_of_silver": true,
        "owner_id": 1,
        "category": "necklace"
      };

      const data = await fakeRequest(app)
        .get('/jewelry/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    //POST
    test('returns a new jewelry item and is in our list of jewelry items', async () => {

      const newPiece =
      {
        name: 'larry',
        image: 'http://placekitten.com/g/200/200',
        description: 'a mooooooood ring',
        price: 20,
        category_id: 2,
        made_of_silver: false,
        owner_id: 1
      };

      const expectedPiece = {
        ...newPiece,
        id: 7,
        owner_id: 1,
        // category: 'ring'
      };

      const data = await fakeRequest(app)
        .post('/jewelry')
        .send(newPiece)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectedPiece);

      const allPieces = await fakeRequest(app)
        .get('/jewelry')
        .expect('Content-Type', /json/)
        .expect(200);

      const getExpectation = {
        ...expectedPiece,
        category: 'ring'
      };

      // const larry = allPieces.body.find(piece => piece.name === 'larry');
      // expect(larry).toEqual(getExpectation);
      expect(allPieces.body).toContainEqual(getExpectation);
    });

    //PUT
    test('updates a single jewelry item', async () => {

      const updatedPiece = {
        name: "mary-antoinette",
        image: "http://placekitten.com/g/200/500",
        description: "choker",
        price: 10000,
        category: "necklace",
        category_id: 1,
        made_of_silver: true,
      };

      const expectedItem = {
        ...updatedPiece,
        id: 4,
        owner_id: 1,

      };

      await fakeRequest(app)
        .put('/jewelry/4')
        .send(updatedPiece)
        .expect('Content-Type', /json/)
        .expect(200);

      const changedPiece = await fakeRequest(app)
        .get('/jewelry/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(changedPiece.body).toEqual(expectedItem);
    });

    //DELETE
    test('deletes a single jewelry item with matching id', async () => {

      const deletedPiece = {
        name: "dianna",
        image: "http://placekitten.com/g/200/300",
        description: "antique teacup peice set in .925 silver, silver chain included",
        price: 60,
        category_id: 1,
        made_of_silver: true,
      }

      const expectedItem = {
        ...deletedPiece,
        id: 6,
        owner_id: 1,

      };

      await fakeRequest(app)
        .delete('/jewelry/6')
        .expect('Content-Type', /json/)
        .expect(200);

      const noMorePiece = await fakeRequest(app)
        .get('/jewelry/6')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(noMorePiece.body).toEqual("");
    });

  });

  //Error Handling 
  test('when using post and given a number instead of a string for name, an error should be thrown', async () => {
    const newPiece =
    {
      name: 44,
      image: 'http://placekitten.com/g/200/200',
      description: 'a mooooooood ring',
      price: 20,
      category_id: 2,
      made_of_silver: false,
      owner_id: 1
    };

    const expectedPiece = {
      ...newPiece,
      id: 8,
      owner_id: 1,

    }
      ;

    const data = await fakeRequest(app)
      .post('/jewelry')
      .send(newPiece)
      .expect('Content-Type', /json/)
      .expect(500);

    expect(data.body).toEqual({"error": "Client was closed and is not queryable"});

  });


});

