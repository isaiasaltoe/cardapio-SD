class Admins::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: 'Login realizado com sucesso',
      admin: { id: resource.id, email: resource.email }
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_admin
      render json: { message: 'Logout realizado com sucesso' }, status: :ok
    else
      render json: { message: 'Token inválido' }, status: :unauthorized
    end
  end
end
