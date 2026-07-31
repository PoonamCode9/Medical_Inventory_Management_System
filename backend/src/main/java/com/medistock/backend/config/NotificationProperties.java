package com.medistock.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Binds the "medistock.notification.*" settings from application.yml
 * so they can be injected anywhere instead of hard-coded.
 */
@Component
@ConfigurationProperties(prefix = "medistock.notification")
public class NotificationProperties {

    /** Who receives expiry alert emails. */
    private List<String> recipientEmails;

    /** "From" address on outgoing mail. */
    private String fromEmail;

    /** Days-to-expiry at/under which a medicine is "near expiry". */
    private int nearExpiryThresholdDays = 90;

    /** Days-to-expiry at/under which a medicine is "critical" (still not expired). */
    private int criticalThresholdDays = 30;

    private String checkCron = "0 0 8 * * *";

    private boolean runOnStartup = true;

    public List<String> getRecipientEmails() { return recipientEmails; }
    public void setRecipientEmails(List<String> recipientEmails) { this.recipientEmails = recipientEmails; }

    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }

    public int getNearExpiryThresholdDays() { return nearExpiryThresholdDays; }
    public void setNearExpiryThresholdDays(int nearExpiryThresholdDays) { this.nearExpiryThresholdDays = nearExpiryThresholdDays; }

    public int getCriticalThresholdDays() { return criticalThresholdDays; }
    public void setCriticalThresholdDays(int criticalThresholdDays) { this.criticalThresholdDays = criticalThresholdDays; }

    public String getCheckCron() { return checkCron; }
    public void setCheckCron(String checkCron) { this.checkCron = checkCron; }

    public boolean isRunOnStartup() { return runOnStartup; }
    public void setRunOnStartup(boolean runOnStartup) { this.runOnStartup = runOnStartup; }
}
