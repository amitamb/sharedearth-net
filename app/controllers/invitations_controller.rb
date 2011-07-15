class InvitationsController < ApplicationController
  before_filter :authenticate_user!, :only => [:purge]
    
  def create    
    invitations = params[:invitations].to_i
    items = params[:items].to_i
    
    redirect_to new_admin_invitation_path, :notice => "Please enter correct data in fields" and return if (invitations <= 0  || items < 0)
    people = Person.with_items_more_than(items)
      @invites = []
      invitations.times do |inv|
        @invites += people.collect { |person| Invitation.new(:inviter_person_id => person.id, :invitation_active => true) }
      end
      if @invites.each(&:save!)
        redirect_to admin_invitations_path, :notice => "Successfully created invitations."
      else
        redirect_to new_admin_invitation_path
      end
  end
  
  def preview
    invitations = params[:invitations].to_i
    items = params[:items].to_i
    people = Person.with_items_more_than(items)
    people_count = people.count
    invitation_count = invitations * people_count
   respond_to do |format|
      format.html { redirection_rules(model_name) }
      format.json do
      
        render :json => { :success => true, :invites => invitation_count  }
      end
    end
  end
  
  def switch
    if Settings.invitations == 'false'
       Settings.invitations = 'true'
    else 
       Settings.invitations = 'false'
    end
    redirect_to admin_dashboard_path
  end
  
  def validate
   key = params[:key]
   unless key.empty?
     invitation = Invitation.find_by_invitation_unique_key(key)
     if !invitation.nil? && invitation.active?
        invitation.update_attributes(:invitee_person_id => current_user.person.id, :accepted_date => Time.now, :invitation_active => false)
        current_user.person.authorise!
        current_user.inform_mutural_friends(session[:fb_token])
        redirect_to terms_path and return
     end
   end 
   redirect_to root_path, :notice => "The code you have provided is invalid or inactive" 
  end
  
  def purge
    current_user.destroy
    session[:user_id] = nil
    redirect_to root_path
  end
  
end
