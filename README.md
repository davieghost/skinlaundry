## Middleman

Middleman is a simple command-line development environment for static sites.  The major benefits are: (1) a sass compiler, (2) an embedded ruby compiler, and (3) automated builds with css/js/html minification, g-zipping, image optimization, and asset fingerprinting (for cache performance).  The documentation is concise and well-organized.  See middlemanapp.com.

### Installation

1.  Make sure ruby is installed by running `ruby -v`. 

2.  Check if bundler is installed by running `bundler -v`.  If it's not installed, run `gem install bundler`.  Bundler will manage all of the gems in the Gemfile.

3.  Run `bundle install` from within the root folder of the repo.  This will install all the gems in the Gemfile, including middleman. 

### Developing with middleman

Start the middleman server by running `middleman server`.  Then open your browser and go to localhost:4567.  Then you can edit any of the source files, and middleman will automatically compile the sass and embedded ruby.  Whenever you save a change to any of the source files, middleman will automatically refresh your browser (unless you disable livereload in the config.rb file).  

### Deploying with middleman

Run `middleman build --no-clean` from within the root folder of the repo.  

The `build` command creates a new folder called "build" that contains all of the static production files for the site.  You can set the options for the build (e.g. minification, g-zipping, etc.) in the "configure :build" section of config.rb.  

The `--no-clean` option will prevent middleman from overwriting any files that already exist in the build folder but aren't part of the build.  This is important because wordpress will live in the build folder (so that it has the same document root as the static files).  
