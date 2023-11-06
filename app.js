const $jobs = $('#jobs');
let filtersArr = [];
let filters = $('.filter-item');

function displayJobs(filter = []) {
	$jobs.empty();

	$.ajax({
		url: "./data.json",
		type: "get",
		dataType: "json", 
		success: function(res) {
			const jobsData = res;
			let jobHTML = "";

			jobsData.forEach((job) => {
				const tags = [];
				const tools = [];
				const langs = [];
				let jobTagsHTML = "";

				tags.push(job.role);
				tags.push(job.level);
				
				if ( job.languages.length ) {
					const langs = job.languages;
					langs.forEach((lang) => {
						jobTagsHTML += `<a href="#${lang}" class="tag-item language">${lang}</a>`;
						tags.push(lang);
					});
				}
				if ( job.tools.length ) {
					const tools = job.tools;
					tools.forEach((tool) => {
						jobTagsHTML += `<a href="#${tool}" class="tag-item tool">${tool}</a>`;
						tags.push(tool);
					});
				}

				if(checkFilters(filter, tags)) {
					jobHTML += `<article class="job${(job.featured) ? " featured-job" : ''}">`;
					jobHTML += `<img class="client-logo" src="${job.logo}" alt="${job.company}"/>`;
					jobHTML += '<div class="job-info">';
					jobHTML += '<div class="job-client">';
					jobHTML += `<h3 class="client-name">${job.company}</h3>`;
					if ( job.new || job.featured ) {
						jobHTML += '<div class="badges">';
						if ( job.new ) {
							jobHTML += `<span class="badge-item new">New!</span>`;
						}
						if ( job.featured ) {
							jobHTML += `<span class="badge-item featured">Featured</span>`;
						}
						jobHTML += '</div>';
					}
					jobHTML += '</div>';
					jobHTML += '<div class="job-position">';
					jobHTML += `<h2 class="job-title">${job.position}</h2>`;
					jobHTML += '<div class="job-details">';
					jobHTML += `<span class="postedAt">${job.postedAt}</span>`;
					jobHTML += `<span class="contract">${job.contract}</span>`;
					jobHTML += `<span class="location">${job.location}</span>`;
					jobHTML += '</div>';
					jobHTML += '</div>';
					jobHTML += '</div>';
					jobHTML += '<div class="job-tags">';
					jobHTML += `<a href="#${job.role}" class="tag-item role">${job.role}</a>`;
					jobHTML += `<a href="#${job.level}" class="tag-item level">${job.level}</a>`;
					jobHTML += jobTagsHTML;
					jobHTML += '</div>';
					jobHTML += '</article>';
					$jobs.append(jobHTML);
					jobHTML = "";
					jobTagsHTML = "";
				}
			});
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {	
	if ( filters.length > 0 ) {
		filters.each(function(i,v) {
			filtersArr.push($(v).data('filter'));
		});
	}
	
	displayJobs(filtersArr);
});

$(document).on('click', '.tag-item', function(e) {
	e.preventDefault();
	// add new filter
	const newFilter = $(this).attr('href').slice(1);
	const filtersList = $('.filters-list');
	if ( filtersArr.indexOf(newFilter) === -1 ) {
		filtersArr.push(newFilter);
		filtersList.append(addNewFilter(newFilter));
	}
	// display filter bar
	$('#jobs').addClass('has-filters');
	$('.filter').removeClass('hidden');
	displayJobs(filtersArr);
});

$(document).on('click', '.filter-item > .close', function(e) {
	e.preventDefault();
	console.log(filtersArr);
	console.log($(this).parent().data('filter'));
	filtersArr.splice($(this).parent().data('filter'), 1);
	console.log(filtersArr);
	$(this).parent().remove();
	displayJobs(filtersArr);
});

$('#clear').on('click', function(e) {
	e.preventDefault();
	
	// delete filter bar item
	$('.filter-item').remove();
	
	// empty filter array
	filtersArr = [];
	
	// hide filter bar
	$('#jobs').removeClass('has-filters');
	$('#filters').addClass('hidden');
	
	//reload data
	displayJobs(filtersArr);
});

function checkFilters(arr1, arr2) {
	var counter = 0;
	var result = true;

	if( arr1.length > 0 ) {
		if( arr1.length <= arr2.length ) {
		  for (const el of arr1) {
		  	if (arr2.includes(el)) {
		      counter++;
		    }
		  }
		  if(counter === arr1.length) {
		  	result = true;
		  } else {
		  	result = false;
		  }
		} else {
		 	result = false;
		}
	} else {
		result = true;
	}

	return result;
}

function addNewFilter(filter) {
	let html = `<div class="filter-item" data-filter="${filter}"><span class="filter-label">${filter}</span><span class="close">&times</span></div>`;
	return html;
}