class PublicController < ApplicationController
  def employees
    render json: Employee.all
  end
end
