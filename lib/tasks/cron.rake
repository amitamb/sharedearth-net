desc "This task is called by the Heroku cron add-on"
task :cron => :environment do
  include PagesHelper
    unactive_user_ids = User.unactive.collect(&:id)
    @persons = Person.notification_cantidate.include_users(unactive_user_ids)
    @persons.each do |p| 
      @recent_activity_logs = ActivityLog.include_person(p).unread.email_not_sent
      unless @recent_activity_logs.nil?
				begin
		      UserMailer.notify_with_recent_activity(@recent_activity_logs, 'zoricn@gmail.com', p.user).deliver
		      email_notification = EmailNotification.create!(:person_id => p.id, :email => p.email)
		      @recent_activity_logs.each { |a| a.log_notification_email!(email_notification) }
          p.increase_email_notification_count!
          p.log_email_notification_time!
		    rescue Exception => e
		      puts "Email sending failed"
		    end
			end
		end
end