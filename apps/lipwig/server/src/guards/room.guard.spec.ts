import { RoomGuard } from './room.guard';

describe('RoomGuard', () => {
    it('should be defined', () => {
        expect(new RoomGuard(null, null)).toBeDefined();
    });
});
