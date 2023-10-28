import { Routes } from '@angular/router';


import { SiteadminAuthoritiesComponent } from '../../siteadmin-authorities/siteadmin-authorities.component';
import { SiteadminCreatorsComponent } from '../../siteadmin-creators/siteadmin-creators.component';
import { SiteadminStripeComponent } from '../../siteadmin-stripe/siteadmin-stripe.component';
import { SiteadminAdministrationComponent } from '../../siteadmin-administration/siteadmin-administration.component';

import { BountiesComponent } from '../../bounties/bounties.component';
import { PortfolioComponent } from '../../portfolio/portfolio.component';
import { QualificationsComponent } from '../../qualifications/qualifications.component';
import { PaymentsComponent } from '../../payments/payments.component';
import { SheduleInterviewComponent } from '../../shedule-interview/shedule.component';
import { ManagementComponent } from '../../management/management.component';
import { QueueComponent } from '../../queue/queue.component';
import { OutreachComponent } from '../../outreach/outreach.component';
import { CreatorsComponent } from '../../creators/creators.component';
import { DisbursementsComponent } from '../../disbursements/disbursements.component';
import { BillingComponent } from '../../billing/billing.component';
import { LinkgmailComponent } from '../../linkgmail/linkgmail.component';
import { SettingComponent } from '../../setting/setting.component';
import { SiteadminHomeComponent } from '../../siteadmin-home/siteadmin-home.component'
import { BaseComponent } from '../../base/base.component';

import { SearchBountyComponent } from '../../search-bounty/search-bounty.component';
import { SubmitBountyComponent } from '../../submit-bounty/submit-bounty.component'
import { BountiesInProgressComponent } from '../../bounties-in-progress/bounties-in-progress.component';
import { FlexDropdownComponent } from '../../flex-components/flex-dropdown/flex-dropdown.component';
import { AddkeywordComponent } from '../../../_components/addkeyword/addkeyword.component';
import { TeamComponent } from '../../../_components/team/team.component';
import { CalendarComponent } from '../../calendar/calendar.component';
import { CompletedComponent } from '../../completed/completed.component';
import { InProgressComponent } from '../../in-progress/in-progress.component';
import { BountyDetailComponent } from '../../bounty-detail/bounty-detail.component';
import { CampaignsComponent } from '../../campaigns/campaigns.component';
import { WriterApplicationComponent } from '../../writer-application/writer-application.component';
import { sucessComponent } from '../../resetsucess/sucess.component';
import { welcomeComponent } from '../../welcome/welcome.component';
import { BountyCheckinComponent } from '../../bounty-checkin/bounty-checkin.component';
import { InhouseComponent } from '../../inhouse/inhouse.component';
import { MenuComponent } from '../../menu-component/menu-component';
import { BountyCreateComponent } from '../../bounties/bounty-create/bounty-create.component';

import { ContentHubComponent } from '../../content-hub/content-hub.component';

import { CompetitorsComponent } from '../../competitors/competitors.component';
import { CompetitorKeywordsComponent } from '../../competitor-keywords/competitor-keywords.component';
import { CommercializationComponent } from '../../commercialization/commercialization.component';
import { LinkBuildingComponent } from '../../link-building/link-building.component';
import { KeywordsComponent } from '../../keywords/keywords.component';
import { GuestPostOpportunitiesComponent } from '../../guest-post-opportunities/guest-post-opportunities.component';

import { UploadReferringDomainsComponent } from '../../upload-referring-domains/upload-referring-domains.component';
import { UploadEmailProspectsComponent } from '../../upload-email-prospects/upload-email-prospects.component';

import { EmailsComponent } from '../../emails/emails.component';
import { EmailResearchComponent } from '../../../_components/email-research/email-research.component';
import { SniperCampaignResearchComponent } from '../../sniper-campaign-research/sniper-campaign-research.component';

import { EmailSendComponent } from '../../email-send/email-send.component';
import { SniperEmailsComponent } from '../../sniper-emails/sniper-emails.component';
import { DeveloperTaskComponent } from '../../developer-task/developer-task.component'
import { AnimatedButtonComponent } from '../../animatedbutton/button.component'
import { EmailReceivedComponent } from '../../email-received/email-received.component';
import { HaroComponent } from '../../haro/haro.component';
import { BountyCreateComponentv2 } from '../../bounty-create_version2/bounty-createv2.component';
import { DevicesComponent } from '../../devices/devices.component';

import { ContentPlannerComponent } from '../../content-planner/content-planner.component';
import { BountyHistoryDataComponent } from '../../bounty-history-data/bounty-history-data.component';
import { BountyHistoryCardComponent } from '../../bounty-history-card/bounty-history-card.component';
import { FilesComponent} from '../../files/files.component';
import { KickbackComponent} from '../../kickback/kickback.component';
import { SearchselectbountyComponent} from '../../searchselectbounty/searchselectbounty.component';
import { EditbulkComponent} from '../../editbulk/editbulk.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'kickback', component: SearchselectbountyComponent },
  { path: 'kickback', component: EditbulkComponent },
  { path: 'kickback', component: KickbackComponent },
  { path: 'upload-referring-domains', component: UploadReferringDomainsComponent },
  { path: 'upload-email-prospects', component:UploadEmailProspectsComponent },
  
  // { path: '', component: CreatorsComponent },
  { path: 'files', component: FilesComponent},
  { path: 'siteadmin_home', component: SiteadminHomeComponent },
  { path: 'siteadmin_authorities', component: SiteadminAuthoritiesComponent },
  { path: 'siteadmin_creators', component: SiteadminCreatorsComponent },
  { path: 'siteadmin_stripe', component: SiteadminStripeComponent },
  { path: 'siteadmin_administration', component: SiteadminAdministrationComponent },
  { path: 'bounties', component: BountiesComponent },
  { path: 'create-bounty', component: BountyCreateComponent },
  { path: 'create-bountyv2', component: BountyCreateComponentv2 },
  { path: 'history', component: BountyHistoryDataComponent },
  { path: 'historyDetails', component: BountyHistoryCardComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'bounties-in-progress', component: BountiesInProgressComponent },
  { path: 'qualifications', component: QualificationsComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'management', component: ManagementComponent },
  { path: 'queue', component: QueueComponent },
  { path: 'outreach', component: OutreachComponent },
  { path: 'disbursements', component: DisbursementsComponent },
  { path: 'creators', component: CreatorsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'linkgmail', component: LinkgmailComponent },
  { path: 'settings', component: SettingComponent },
  { path: 'base', component: BaseComponent },
  { path: 'search_bounties', component: SearchBountyComponent },
  { path: 'submit_bounty', component: SubmitBountyComponent },
  { path: 'shedule_interview', component: SheduleInterviewComponent },
  { path: 'flex-dropdown', component: FlexDropdownComponent },
  { path: 'addkeyword', component: AddkeywordComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'bounty-detail', component: BountyDetailComponent },
  { path: 'team', component: TeamComponent },
  { path: 'in_progress', component: InProgressComponent },
  { path: 'completed', component: CompletedComponent },
  { path: 'campaigns', component: CampaignsComponent },
  { path: 'writer_application', component: WriterApplicationComponent },
  { path: 'success', component: sucessComponent },
  { path: 'welcome', component: welcomeComponent },
  { path: 'checkin', component: BountyCheckinComponent },
  { path: 'inhouse', component: InhouseComponent },
  { path: 'menus', component: MenuComponent },
  { path: 'devices', component: DevicesComponent },
  
   { path: '', component: welcomeComponent },
   { path: 'component-hub', component: ContentHubComponent },
   { path: 'competitors', component: CompetitorsComponent },
   { path: 'competitor-keyword', component: CompetitorKeywordsComponent },
   { path: 'commercialization', component: CommercializationComponent },
   { path: 'link-building', component: LinkBuildingComponent },
   { path: 'keywords', component: KeywordsComponent },
   { path: 'guest-postOpportunities', component: GuestPostOpportunitiesComponent },
  { path: 'emails', component: EmailsComponent },
  { path: 'email-research', component: EmailResearchComponent },


  { path: 'emails', component: EmailsComponent },
  { path: 'email-send', component: EmailSendComponent },
  { path: 'link-building-communication', component: SniperEmailsComponent },

  { path: 'email-received', component: EmailReceivedComponent },

  { path: 'haro', component: HaroComponent },
  { path: 'developer-task', component: DeveloperTaskComponent },
  { path: 'content-planner', component: ContentPlannerComponent }
];
