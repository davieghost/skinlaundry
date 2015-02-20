###
# Compass
###

# activate :directory_indexes

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload
# end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end
def isEnvironment environment
  ENV['RACK_ENV'] == environment
end

def isProduction 
  isEnvironment "production"
end

$GOOGLE_API_KEY = 'AIzaSyCRlB_IGbIXk3WEEreLjAbYYOaq5SGHTC8'
ENVIRONMENT = ENV['RACK_ENV'] ||= 'development'
$BOOKING_ENDPOINT = isProduction ? ENV['BOOKING_ENDPOINT'] : "http://sl-book.herokuapp.com/"
$SHOPIFY_BASE_URL = isProduction ? ENV['SHOPIFY_BASE_URL'] : "http://shop.skinlaundry.com/"
$COOKIE_DOMAIN = isProduction ? ENV['COOKIE_DOMAIN'] : ""
$LOCATIONS_LIST = JSON.parse(File.read(ENV["MM_ROOT"] + "/jsons/stores.json"))

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

# Build-specific configuration
configure :build do

  # optimize images
  # activate :imageoptim 
  
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

#Proxying for all the LOCATIONS list
$LOCATIONS_LIST["current"].each do |key, location|
  proxy "/locations/#{key}.html", "/location-single.html", :locals => { :location => location, :location_key => key }
  p "proxied url for #{key} location"
end
