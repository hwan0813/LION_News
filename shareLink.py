'''
import datetime

import dropbox


dbx = dropbox.Dropbox("C0w-C7kkDNAAAAAAAAAAE44R8t2689JstWqe2B8W6xMxUZXuSZnYCQ3tF3wqBizQ")

expires = datetime.datetime.now() + datetime.timedelta(days=30)
requested_visibility = dropbox.sharing.RequestedVisibility.public
desired_shared_link_settings = dropbox.sharing.SharedLinkSettings(requested_visibility=requested_visibility, expires=expires)

shared_link_metadata = dbx.sharing_create_shared_link_with_settings("/실험하기.txt", settings=desired_shared_link_settings)

print(shared_link_metadata)
print(sharing_get_shared_links)
'''
import dropbox
db = dropbox.Dropbox('C0w-C7kkDNAAAAAAAAAAE44R8t2689JstWqe2B8W6xMxUZXuSZnYCQ3tF3wqBizQ')
response = db.files_list_folder('/home')
for file in response.entries:
	print (file.path_lower)
shared_link_metadata = db.sharing_create_shared_link_with_settings(file.path_lower)
print (shared_link_metadata.url)