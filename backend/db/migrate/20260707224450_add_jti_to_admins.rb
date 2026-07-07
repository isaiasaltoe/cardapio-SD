class AddJtiToAdmins < ActiveRecord::Migration[8.1]
  def change
    add_column :admins, :jti, :string, null: false, default: ""
    add_index :admins, :jti, unique: true
    Admin.find_each { |admin| admin.update_column(:jti, SecureRandom.uuid) }
  end
end
