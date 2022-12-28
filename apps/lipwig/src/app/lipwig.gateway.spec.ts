import { Test, TestingModule } from '@nestjs/testing';
import { LipwigGateway } from './lipwig.gateway';

describe('LipwigGateway', () => {
    let gateway: LipwigGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LipwigGateway],
        }).compile();

        gateway = module.get<LipwigGateway>(LipwigGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
