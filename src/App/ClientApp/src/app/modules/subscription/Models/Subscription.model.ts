export class SubscriptionRequest {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export class SubscriptionResponse {
  subscriptionId: string;
  status: SubscribeStatusEnum;
  approvalLink: string;
  baToken: string;
}

export enum SubscribeStatusEnum {
  // ReSharper disable InconsistentNaming
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  APPROVAL = 'APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  NOT_SUBSCRIBED = 'NOT_SUBSCRIBED'
  // ReSharper restore InconsistentNaming
}
