import { SearchselectbountyComponent } from '../../searchselectbounty/searchselectbounty.component'
import { EditbulkComponent } from '../../editbulk/editbulk.component'
import { KickbackComponent } from '../../kickback/kickback.component'
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../../_matrial';
import { AdminLayoutRoutes } from './admin-layout.routing';


import { SiteadminAuthoritiesComponent } from '../../siteadmin-authorities/siteadmin-authorities.component';
import { SiteadminCreatorsComponent } from '../../siteadmin-creators/siteadmin-creators.component';
import { SiteadminStripeComponent } from '../../siteadmin-stripe/siteadmin-stripe.component';
import { SiteadminAdministrationComponent } from '../../siteadmin-administration/siteadmin-administration.component';


import { BountiesComponent } from '../../bounties/bounties.component';
import { PortfolioComponent } from '../../portfolio/portfolio.component';
import { QualificationsComponent } from '../../qualifications/qualifications.component';


import { PaymentsComponent } from '../../payments/payments.component';

import { ManagementComponent } from '../../management/management.component';
import { OutreachComponent } from '../../outreach/outreach.component';
import { CreatorsComponent } from '../../creators/creators.component';
import { DisbursementsComponent } from '../../disbursements/disbursements.component';
import { FlexibleComponent } from '../../flexible-table/flexible-table.component';
import { ShortPipe } from '../../flexible-table/short-pipe';
import { ReplaceUnderscorePipe } from '../../../custom_pipe/allpipe';
import { BillingComponent } from '../../billing/billing.component';

import { sucessComponent } from '../../resetsucess/sucess.component';
import { welcomeComponent } from '../../welcome/welcome.component';
import { ButtonComponent } from '../../button/button.component';


import { LinkgmailComponent } from '../../linkgmail/linkgmail.component';
import { SettingComponent } from '../../setting/setting.component';
import { BaseComponent } from '../../base/base.component';

import { SiteadminHomeComponent } from '../../siteadmin-home/siteadmin-home.component'

import { QueueComponent } from '../../queue/queue.component';
// import { ClickOutsideModule } from 'ng-click-outside';

import { SnackbarComponent } from '../../snackbar/snackbar.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { SearchBountyComponent } from '../../search-bounty/search-bounty.component';
import { SubmitBountyComponent } from '../../submit-bounty/submit-bounty.component';


import { FabricTypePipe, GrdFilterPipe, FilterPipe } from '../../../custom_pipe/allpipe';
import { BountiesInProgressComponent } from '../../bounties-in-progress/bounties-in-progress.component'

import { SheduleInterviewComponent } from '../../shedule-interview/shedule.component'

import { SharedService } from '../../../_services/shared.service';
import { FlexDropdownComponent } from '../../flex-components/flex-dropdown/flex-dropdown.component'
import { ViewDropdownComponent } from '../../flex-components/view-dropdown/view-dropdown.component'
import { DynamicPriceComponent } from '../../flex-components/dynamic-price/dynamic-price.component'
import { FlexMenuComponent } from '../../flex-components/flex-menu/view-dropdown.component'

import { AddkeywordComponent } from '../../../_components/addkeyword/addkeyword.component';
import { CalendarComponent } from '../../calendar/calendar.component';

// calendar module
import { CalendarCellComponent } from '../../calendar/calendar-cell/calendar-cell.component';
import { CalendarItemComponent } from '../../calendar/calendar-cell/calendar-item/calendar-item.component';
import { CustomDatePipe } from '../../calendar/custom.datepipe';
import { TeamComponent } from '../../../_components/team/team.component';
import { InProgressComponent } from '../../in-progress/in-progress.component';
import { CompletedComponent } from '../../completed/completed.component';
import { BountyDetailComponent } from '../../bounty-detail/bounty-detail.component';

import { CampaignsComponent } from '../../campaigns/campaigns.component';
import { WriterApplicationComponent } from '../../writer-application/writer-application.component';
import { CalendlyWidgetComponent } from '../../writer-application/calendly';

import { DragdropDirective } from '../../../custom_directive/dragdrop.directive';
// import { ClickOutsideDirective } from '../../../custom_directive/click-outside.directive';
import { CustomWebsiteUrlRegValidator } from 'src/app/custom_validator/customWebsiteUrlRegValidator';
import { CustomBudgetRegValidator } from 'src/app/custom_validator/customBudgetRegValidator';
import { BountyCheckinComponent } from '../../bounty-checkin/bounty-checkin.component';
import { InhouseComponent } from '../../inhouse/inhouse.component';
import { MenuComponent } from '../../menu-component/menu-component';

import { ContentHubComponent } from '../../content-hub/content-hub.component';

import { CompetitorsComponent } from '../../competitors/competitors.component';
import { CompetitorKeywordsComponent } from '../../competitor-keywords/competitor-keywords.component';
import { CommercializationComponent } from '../../commercialization/commercialization.component';
import { LinkBuildingComponent } from '../../link-building/link-building.component';
import { KeywordsComponent } from '../../keywords/keywords.component';
import { GuestPostOpportunitiesComponent } from '../../guest-post-opportunities/guest-post-opportunities.component';


import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ComponentsModule } from '../../components/components.module';
import { BountyCreateComponent } from '../../bounties/bounty-create/bounty-create.component';
import { CreateKeywordComponent } from '../../management/create-keyword/create-keyword.component';
import { DeveloperTaskComponent } from '../../developer-task/developer-task.component';

import { UploadReferringDomainsComponent } from '../../upload-referring-domains/upload-referring-domains.component';
import { UploadEmailProspectsComponent } from '../../upload-email-prospects/upload-email-prospects.component';
import { FileUploadComponent } from '../../file-upload/file-upload.component';

import { EmailsComponent } from '../../emails/emails.component';
import { EmailResearchComponent } from '../../../_components/email-research/email-research.component';

import { SniperCampaignResearchComponent } from '../../sniper-campaign-research/sniper-campaign-research.component';

import { SniperEmailsComponent } from '../../sniper-emails/sniper-emails.component';
import { EmailSendComponent } from '../../email-send/email-send.component';

import { EditorModule } from '@tinymce/tinymce-angular';
import { AnimatedButtonComponent } from '../../animatedbutton/button.component'

import { BadgesReuseableComponent } from '../../badges-reuseable/badges-reuseable.component';
import { EmailReceivedComponent } from '../../email-received/email-received.component';
import { EmailResponseComponent } from '../../email-response/email-response.component';
import { EmailReceivedActionsComponent } from '../../email-received-actions/email-received-actions.component';
import { FormGeneratorComponent } from '../../form-generator/form-generator.component';

import { HaroComponent } from '../../haro/haro.component';
import { BountyCreateComponentv2 } from '../../bounty-create_version2/bounty-createv2.component';
import { DevicesComponent } from '../../devices/devices.component';

import { ContentPlannerComponent } from '../../content-planner/content-planner.component';
import { BountyHistoryDataComponent } from '../../bounty-history-data/bounty-history-data.component';
import { BountyHistoryCardComponent } from '../../bounty-history-card/bounty-history-card.component';
import { BountySummaryComponent } from '../../bounty-summary/bounty-summary.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FilesComponent } from '../../files/files.component';

import { NgxDateRangeModule } from 'ngx-daterange';
// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
    imports: [
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        MatPaginatorModule,
        MatSortModule,
        // ClickOutsideModule,
        HttpClientModule,
        DragDropModule,
        CommonModule,
        ComponentsModule,
        EditorModule,
        NgxDateRangeModule,
        LottieModule.forRoot({ player: playerFactory })
    ],
    declarations: [
        SearchselectbountyComponent,
        EditbulkComponent,
        KickbackComponent,
        SiteadminAuthoritiesComponent,
        SiteadminCreatorsComponent,
        SiteadminStripeComponent,
        SiteadminAdministrationComponent,
        PortfolioComponent,
        BountiesComponent,
        PaymentsComponent,
        QualificationsComponent,
        ManagementComponent,
        QueueComponent,
        OutreachComponent,
        CreatorsComponent,
        DisbursementsComponent,
        FlexibleComponent,
        BillingComponent,
        sucessComponent,
        LinkgmailComponent,
        SettingComponent,
        SiteadminHomeComponent,
        BaseComponent,
        SnackbarComponent,
        ShortPipe,
        ReplaceUnderscorePipe,
        FabricTypePipe,
        GrdFilterPipe,
        FilterPipe,
        SearchBountyComponent,
        SubmitBountyComponent,
        BountiesInProgressComponent,
        SheduleInterviewComponent,
        FlexDropdownComponent,
        ViewDropdownComponent,
        FlexMenuComponent,
        AddkeywordComponent,
        CalendarComponent,
        CalendarCellComponent,
        CalendarItemComponent,
        CustomDatePipe,
        TeamComponent,
        InProgressComponent,
        CompletedComponent,
        BountyDetailComponent,
        CampaignsComponent,
        DynamicPriceComponent,
        WriterApplicationComponent,
        CalendlyWidgetComponent,
        DragdropDirective,
        // ClickOutsideDirective,
        welcomeComponent,
        ButtonComponent,
        CustomWebsiteUrlRegValidator,
        CustomBudgetRegValidator,
        BountyCheckinComponent,
        InhouseComponent,
        MenuComponent,
        ContentHubComponent,
        CompetitorsComponent,
        CompetitorKeywordsComponent,
        CommercializationComponent,
        LinkBuildingComponent,
        KeywordsComponent,
        GuestPostOpportunitiesComponent,
        BountyCreateComponent,
        BountyCreateComponentv2,
        CreateKeywordComponent,
        UploadReferringDomainsComponent,
        UploadEmailProspectsComponent,
        EmailsComponent,
        DeveloperTaskComponent,
        FileUploadComponent,
        EmailsComponent,
        EmailResearchComponent,
        SniperCampaignResearchComponent,
        SniperEmailsComponent,
        EmailSendComponent,
        AnimatedButtonComponent,
        BadgesReuseableComponent,
        EmailReceivedComponent,
        EmailResponseComponent,
        EmailReceivedActionsComponent,
        FormGeneratorComponent,
        HaroComponent,
        DevicesComponent,
        ContentPlannerComponent,
        BountyHistoryDataComponent,
        BountyHistoryCardComponent,
        BountySummaryComponent,
        FilesComponent
    ],
    exports: [FlexibleComponent, MatPaginatorModule,
        MatSortModule,],
    providers: [SharedService]
})
export class AdminLayoutModule { }
