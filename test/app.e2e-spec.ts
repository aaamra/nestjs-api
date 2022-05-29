import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { LoginDto, SignUpDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth Tests', () => {
    describe('Sign Up', () => {
      const dto: SignUpDto = {
        name: 'Abdallah',
        email: 'abd@gmail.com',
        password: 'helloworld',
      };
      it('sign up with 201 status', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw an error when email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error when password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw an error when empty body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
    });

    describe('Login', () => {
      const dto: LoginDto = {
        email: 'abd@gmail.com',
        password: 'helloworld',
      };
      it('log in with 200 status', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });

      it('should throw an error when email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error when password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw an error when empty body', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
    });
  });

  describe('User Tests', () => {
    describe('Get Me', () => {
      it('return auth user (me)', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {});
  });

  describe('Bookmark Tests', () => {
    describe('Crate Bookmark', () => {});

    describe('Get Bookmarks', () => {});

    describe('Get Bookmark by id', () => {});

    describe('Edit Bookmark by id', () => {});

    describe('Delete Bookmarks by id', () => {});
  });
});
