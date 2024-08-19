import Mentor from '@models/Mentor';
import User from '@models/User';

export type UserType = InstanceType<typeof User> & InstanceType<typeof Mentor>;
