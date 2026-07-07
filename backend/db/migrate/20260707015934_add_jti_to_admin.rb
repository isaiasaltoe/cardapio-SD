class AddJtiToAdmins < ActiveRecord::Migration[7.1]
  def change
    add_column :admins, :jti, :string, null: false, default: ""
    add_index :admins, :jti, unique: true
  end
end
