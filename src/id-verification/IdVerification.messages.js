import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'id.verification.next': {
    id: 'id.verification.next',
    defaultMessage: 'Next',
    description: 'Next button.',
  },
  'id.verification.support': {
    id: 'id.verification.support',
    defaultMessage: 'support',
    description: 'Website support.',
  },
  'id.verification.example.card.alt': {
    id: 'id.verification.example.card.alt',
    defaultMessage: 'Example of a valid identification card with a full name and photo.',
    description: 'Alt text for an example identification card.',
  },
  'id.verification.requirements.title': {
    id: 'id.verification.requirements.title',
    defaultMessage: 'Photo Verification Requirements',
    description: 'Title for the Photo Verification Requirements page.',
  },
  'id.verification.requirements.description': {
    id: 'id.verification.requirements.description',
    defaultMessage: 'In order to complete Photo Verification, you will need the following:',
    description: 'Description for the Photo Verification Requirements page.',
  },
  'id.verification.requirements.card.device.title': {
    id: 'id.verification.requirements.card.device.title',
    defaultMessage: 'Device with Camera',
    description: 'Title for the Device with Camera card.',
  },
  'id.verification.requirements.card.device.allow': {
    id: 'id.verification.requirements.card.device.allow',
    defaultMessage: 'Allow',
    description: 'Bold text emphasizing that the user needs to click "allow" in order to enable the camera.',
  },
  'id.verification.requirements.card.id.title': {
    id: 'id.verification.requirements.card.id.title',
    defaultMessage: 'Photo Identification Card',
    description: 'Title for the Photo Identification requirement card.',
  },
  'id.verification.requirements.card.id.text': {
    id: 'id.verification.requirements.card.id.text',
    defaultMessage: 'You need a valid identification card that contains your full name and photo, such as a driver’s license or passport.',
    description: 'Text that explains that the user needs a photo ID.',
  },
  'id.verification.privacy.title': {
    id: 'id.verification.privacy.title',
    defaultMessage: 'Privacy Information',
    description: 'Title for Privacy Information.',
  },
  'id.verification.privacy.need.photo.question': {
    id: 'id.verification.privacy.need.photo.question',
    defaultMessage: 'Why does {siteName} need my photo?',
    description: 'Question about why the platform needs a verification photo.',
  },
  'id.verification.privacy.need.photo.answer': {
    id: 'id.verification.privacy.need.photo.answer',
    defaultMessage: 'We use your verification photos to confirm your identity and ensure the validity of your certificate.',
    description: 'Answering why the platform needs a verification photo.',
  },
  'id.verification.privacy.do.with.photo.question': {
    id: 'id.verification.privacy.do.with.photo.question',
    defaultMessage: 'What does {siteName} do with this photo?',
    description: 'Question about what the platform does with the verification photo.',
  },
  'id.verification.privacy.do.with.photo.answer': {
    id: 'id.verification.privacy.do.with.photo.answer',
    defaultMessage: 'We securely encrypt your photo and send it our authorization service for review. Your photo and information are not saved or visible anywhere on {siteName} after the verification process is complete.',
    description: 'Answering what the platform does with the verification photo.',
  },
  'id.verification.access.blocked.title': {
    id: 'id.verification.access.blocked.title',
    defaultMessage: 'Identity Verification',
    description: 'Title for text that displays when a user is blocked from ID verification.',
  },
  'id.verification.access.blocked.enrollment': {
    id: 'id.verification.access.blocked.enrollment',
    defaultMessage: 'You are not currently enrolled in a course that requires identity verification.',
    description: 'Text that displays when user is trying to verify while not enrolled in a course that requires ID verification.',
  },
  'id.verification.access.blocked.pending': {
    id: 'id.verification.access.blocked.pending',
    defaultMessage: 'You have already submitted your verification information. You will see a message on your dashboard when the verification process is complete (usually within 5 days).',
    description: 'Text that displays when user has a pending or approved request.',
  },
  'id.verification.photo.take': {
    id: 'id.verification.photo.take',
    defaultMessage: 'Take Photo',
    description: 'Button to take photo.',
  },
  'id.verification.photo.retake': {
    id: 'id.verification.photo.retake',
    defaultMessage: 'Retake Photo?',
    description: 'Button to retake photo.',
  },
  'id.verification.photo.enable.detection': {
    id: 'id.verification.photo.enable.detection',
    defaultMessage: 'Enable Face Detection',
    description: 'Text label for the checkbox to enable face detection.',
  },
  'id.verification.photo.enable.detection.portrait.help.text': {
    id: 'id.verification.photo.enable.detection.portrait.help.text',
    defaultMessage: 'If checked, a box will appear around your face. Your face can be seen clearly if the box around it is blue. If your face is not in a good position or undetectable, the box will be red.',
    description: 'Help text that appears for enabling face detection on the portrait photo panel.',
  },
  'id.verification.photo.enable.detection.id.help.text': {
    id: 'id.verification.photo.enable.detection.id.help.text',
    defaultMessage: 'If checked, a box will appear around the face on your ID card. The face can be seen clearly if the box around it is blue. If the face is not in a good position or undetectable, the box will be red.',
    description: 'Help text that appears for enabling face detection on the portrait photo panel.',
  },
  'id.verification.photo.feedback.correct': {
    id: 'id.verification.photo.feedback.correct',
    defaultMessage: 'Face is in a good position.',
    description: 'Text for screen reader when user\'s face is in a good position.',
  },
  'id.verification.photo.feedback.two.faces': {
    id: 'id.verification.photo.feedback.two.faces',
    defaultMessage: 'More than one face detected.',
    description: 'Text for screen reader when more than one face detected.',
  },
  'id.verification.photo.feedback.no.faces': {
    id: 'id.verification.photo.feedback.no.faces',
    defaultMessage: 'No face detected.',
    description: 'Text for screen reader when no face detected.',
  },
  'id.verification.photo.feedback.top.left': {
    id: 'id.verification.photo.feedback.top.left',
    defaultMessage: 'Incorrect position. Top left.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.top.center': {
    id: 'id.verification.photo.feedback.top.center',
    defaultMessage: 'Incorrect position. Top center.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.top.right': {
    id: 'id.verification.photo.feedback.top.right',
    defaultMessage: 'Incorrect position. Top right.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.center.left': {
    id: 'id.verification.photo.feedback.center.left',
    defaultMessage: 'Incorrect position. Center left.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.center.center': {
    id: 'id.verification.photo.feedback.center.center',
    defaultMessage: 'Incorrect position. Too close to camera.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.center.right': {
    id: 'id.verification.photo.feedback.center.right',
    defaultMessage: 'Incorrect position. Center right.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.bottom.left': {
    id: 'id.verification.photo.feedback.bottom.left',
    defaultMessage: 'Incorrect position. Bottom left.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.bottom.center': {
    id: 'id.verification.photo.feedback.bottom.center',
    defaultMessage: 'Incorrect position. Bottom center.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.photo.feedback.bottom.right': {
    id: 'id.verification.photo.feedback.bottom.right',
    defaultMessage: 'Incorrect position. Bottom right.',
    description: 'Text for screen reader when face is in a bad position.',
  },
  'id.verification.camera.access.title': {
    id: 'id.verification.camera.access.title',
    defaultMessage: 'Camera Permissions',
    description: 'Title for the Camera Access page.',
  },
  'id.verification.camera.access.title.success': {
    id: 'id.verification.camera.access.title.success',
    defaultMessage: 'Camera Access Enabled',
    description: 'Title for the Camera Access page when camera is enabled.',
  },
  'id.verification.camera.access.title.failed': {
    id: 'id.verification.camera.access.title.failed',
    defaultMessage: 'Camera Access Failed',
    description: 'Title for the Camera Access page when camera access is denied or unavailable.',
  },
  'id.verification.camera.access.click.allow': {
    id: 'id.verification.camera.access.click.allow',
    defaultMessage: 'Please make sure to click "Allow"',
    description: 'Instruction to allow camera access.',
  },
  'id.verification.camera.access.enable': {
    id: 'id.verification.camera.access.enable',
    defaultMessage: 'Enable Camera',
    description: 'Text to enable camera.',
  },
  'id.verification.camera.access.problems': {
    id: 'id.verification.camera.access.problems',
    defaultMessage: 'Having problems?',
    description: 'Text for when the user is having problems enabling camera access.',
  },
  'id.verification.camera.access.skip': {
    id: 'id.verification.camera.access.skip',
    defaultMessage: 'Skip and upload image files instead',
    description: 'Text to skip camera access and enable image uploading.',
  },
  'id.verification.camera.access.success': {
    id: 'id.verification.camera.access.success',
    defaultMessage: 'Looks like your camera is working and ready.',
    description: 'Text to confirm that camera is working.',
  },
  'id.verification.camera.access.failure': {
    id: 'id.verification.camera.access.failure',
    defaultMessage: 'It looks like we\'re unable to access your camera. You will need to upload image files of you and your photo id.',
    description: 'Text indicating that the camera could not be accessed and image upload will be enabled.',
  },
  'id.verification.camera.access.failure.temporary': {
    id: 'id.verification.camera.access.failure.temporary',
    defaultMessage: 'It looks like we\'re unable to access your camera. Please verify that your webcam is connected and that you have allowed your browser to access it.',
    description: 'Text indicating that the camera could not be accessed.',
  },
  'id.verification.camera.access.failure.temporary.chrome': {
    id: 'id.verification.camera.access.failure.temporary.chrome',
    defaultMessage: 'To enable camera access in Chrome:',
    description: 'Description for the directions on enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step1': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step1',
    defaultMessage: 'Open Chrome.',
    description: 'Text for step one of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step2': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step2',
    defaultMessage: 'Navigate to More > Settings.',
    description: 'Text for step two of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step2.windows': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step2.windows',
    defaultMessage: 'For Windows: Alt+F, Alt+E, or F10 followed by the spacebar',
    description: 'Text for Windows keyboard shortcut in chrome.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step2.mac': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step2.mac',
    defaultMessage: 'For Mac: Command+,',
    description: 'Text for Mac keyboard shortcut in chrome.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step3': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step3',
    defaultMessage: 'Under the "Privacy and security" tab, select "Site Settings" and then "Camera."',
    description: 'Text for step three of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step4': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step4',
    defaultMessage: 'Under "Blocked," find "edx.org" and select it.',
    description: 'Text for step four of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.chrome.step5': {
    id: 'id.verification.camera.access.failure.temporary.chrome.step5',
    defaultMessage: 'In the "Permissions" section, update the camera permissions to "Allow."',
    description: 'Text for step five of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.ie11': {
    id: 'id.verification.camera.access.failure.temporary.ie11',
    defaultMessage: 'To enable camera access in Internet Explorer:',
    description: 'Description for the directions on enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.ie11.step1': {
    id: 'id.verification.camera.access.failure.temporary.ie11.step1',
    defaultMessage: 'Open the Flash Player Settings Manager by navigating to Windows Settings > Control Panel > Flash Player.',
    description: 'Text for step one of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.ie11.step2': {
    id: 'id.verification.camera.access.failure.temporary.ie11.step2',
    defaultMessage: 'Select the "Camera and Mic" tab, and then select the "Camera and Microphone Settings by Site" button.',
    description: 'Text for step two of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.ie11.step3': {
    id: 'id.verification.camera.access.failure.temporary.ie11.step3',
    defaultMessage: 'Choose "edx.org" from the list of websites and change the permissions by selecting "Allow" in the dropdown menu.',
    description: 'Text for step three of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox': {
    id: 'id.verification.camera.access.failure.temporary.firefox',
    defaultMessage: 'To enable camera access in Firefox:',
    description: 'Description for the directions on enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step1': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step1',
    defaultMessage: 'Open Firefox.',
    description: 'Text for step one of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step2': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step2',
    defaultMessage: 'Enter "about:preferences" in the URL bar.',
    description: 'Text for step two of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step3': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step3',
    defaultMessage: 'Select the "Privacy & Security" tab, and navigate to the "Permissions" section.',
    description: 'Text for step three of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step4': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step4',
    defaultMessage: 'Next to "Camera," select the "Settings…" button.',
    description: 'Text for step four of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step5': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step5',
    defaultMessage: 'In the search bar, enter "edx.org."',
    description: 'Text for step five of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step6': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step6',
    defaultMessage: 'In the status column for "edx.org," select "Allow" from the drop down.',
    description: 'Text for step six of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.firefox.step7': {
    id: 'id.verification.camera.access.failure.temporary.firefox.step7',
    defaultMessage: 'Select "Save Changes."',
    description: 'Text for step seven of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.safari': {
    id: 'id.verification.camera.access.failure.temporary.safari',
    defaultMessage: 'To enable camera access in Safari:',
    description: 'Description for the directions on enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.safari.step1': {
    id: 'id.verification.camera.access.failure.temporary.safari.step1',
    defaultMessage: 'Open Safari.',
    description: 'Text for step one of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.safari.step2': {
    id: 'id.verification.camera.access.failure.temporary.safari.step2',
    defaultMessage: 'Click on the Safari app menu, then select "Preferences." You can also use Command+, as a keyboard shortcut.',
    description: 'Text for step two of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.safari.step3': {
    id: 'id.verification.camera.access.failure.temporary.safari.step3',
    defaultMessage: 'Select the "Websites" tab and then select "Camera."',
    description: 'Text for step three of enabling camera access.',
  },
  'id.verification.camera.access.failure.temporary.safari.step4': {
    id: 'id.verification.camera.access.failure.temporary.safari.step4',
    defaultMessage: 'Select "edx.org" and change the camera permissions to "Allow."',
    description: 'Text for step four of enabling camera access.',
  },
  'id.verification.camera.access.failure.unsupported': {
    id: 'id.verification.camera.access.failure.unsupported',
    defaultMessage: 'It looks like your browser does not support camera access.',
    description: 'Text indicating that the user\'s browser does not support camera access.',
  },
  'id.verification.camera.access.failure.unsupported.chrome.explanation': {
    id: 'id.verification.camera.access.failure.unsupported.chrome.explanation',
    defaultMessage: 'The Chrome browser currently does not support camera access on iOS devices, such as iPhones and iPads.',
    description: 'Explanation for why certain web browsers, like Chrome, do not support accessing the user\'s camera.',
  },
  'id.verification.camera.access.failure.unsupported.instructions': {
    id: 'id.verification.camera.access.failure.unsupported.instructions',
    defaultMessage: 'Please use another browser to complete Identity Verification.',
    description: 'Instructions for the user to user another web browser to complete the process.',
  },
  'id.verification.photo.tips.title': {
    id: 'id.verification.photo.tips.title',
    defaultMessage: 'Helpful Photo Tips',
    description: 'Title for the Photo Tips page.',
  },
  'id.verification.photo.tips.description': {
    id: 'id.verification.photo.tips.description',
    defaultMessage: 'Next, we\'ll need you to take a photo of your face. Please review the helpful tips below.',
    description: 'Description for the photo tips page.',
  },
  'id.verification.photo.tips.list.title': {
    id: 'id.verification.photo.tips.list.title',
    defaultMessage: 'Photo Tips',
    description: 'Title for the list of photo tips.',
  },
  'id.verification.photo.tips.list.description': {
    id: 'id.verification.photo.tips.list.description',
    defaultMessage: 'To take a successful photo, make sure that:',
    description: 'Description for the list of photo tips.',
  },
  'id.verification.photo.tips.list.well.lit': {
    id: 'id.verification.photo.tips.list.well.lit',
    defaultMessage: 'Your face is well-lit.',
    description: 'Tip to make sure the user\'s face is well lit.',
  },
  'id.verification.photo.tips.list.inside.frame': {
    id: 'id.verification.photo.tips.list.inside.frame',
    defaultMessage: 'Your entire face fits inside the frame.',
    description: 'Tip to make sure the user\'s face fits inside the frame.',
  },
  'id.verification.portrait.photo.title.camera': {
    id: 'id.verification.portrait.photo.title.camera',
    defaultMessage: 'Take a Photo of Yourself',
    description: 'Title for the Portrait Photo page if camera access is enabled.',
  },
  'id.verification.portrait.photo.instructions.camera': {
    id: 'id.verification.portrait.photo.instructions.camera',
    defaultMessage: 'When your face is in position, use the Take Photo button below to take your photo.',
    description: 'Instructions to use the camera to take a portrait photo..',
  },
  'id.verification.camera.help.sight.question': {
    id: 'id.verification.camera.help.sight.question',
    defaultMessage: 'What if I can\'t see the camera image or if I can\'t see my photo to determine which side is visible?',
    description: 'Question on what to do if the user cannot see the camera image or photo during verification.',
  },
  'id.verification.camera.help.sight.answer.portrait': {
    id: 'id.verification.camera.help.sight.answer.portrait',
    defaultMessage: 'You may be able to complete the image capture procedure without assistance, but it may take a couple of submission attempts to get the camera positioning right. Optimal camera positioning varies with each computer, but generally the best position for a headshot is approximately 12-18 inches (30-45 centimeters) from the camera, with your head centered relative to the computer screen. If the photos you submit are rejected, try moving the computer or camera orientation to change the lighting angle.',
    description: 'Confirming what to do if the camera image of the portrait cannot be seen during verification.',
  },
  'id.verification.camera.help.sight.answer.id': {
    id: 'id.verification.camera.help.sight.answer.id',
    defaultMessage: 'You may be able to complete the image capture procedure without assistance, but it may take a couple of submission attempts to get the camera positioning right. Optimal camera positioning varies with each computer, but generally, the best position for a photo of an ID card is 8-12 inches (20-30 centimeters) from the camera, with the ID card centered relative to the camera. If the photos you submit are rejected, try moving the computer or camera orientation to change the lighting angle. The most common reason for rejection is inability to read the text on the ID card.',
    description: 'Confirming what to do if the camera image of the ID cannot be seen during verification.',
  },
  'id.verification.camera.help.difficulty.question.portrait': {
    id: 'id.verification.camera.help.difficulty.question.portrait',
    defaultMessage: 'What if I have difficulty holding my head in position relative to the camera?',
    description: 'Question on what to do if the user has difficulty holding their head relative to the camera.',
  },
  'id.verification.camera.help.difficulty.question.id': {
    id: 'id.verification.camera.help.difficulty.question.id',
    defaultMessage: 'What if I have difficulty holding my ID in position relative to the camera?',
    description: 'Question on what to do if the user has difficulty holding their ID relative to the camera.',
  },
  'id.verification.camera.help.difficulty.answer': {
    id: 'id.verification.camera.help.difficulty.answer',
    defaultMessage: 'If you require assistance with taking a photo for submission, contact {siteName} support for additional suggestions.',
    description: 'Confirming what to do if the user has difficult holding their head relative to the camera.',
  },
  'id.verification.id.photo.unclear.question': {
    id: 'id.verification.id.photo.unclear.question',
    defaultMessage: 'Is your ID card image not clear or too blurry?',
    description: 'Question on what to do if the user\'s ID image is unclear',
  },
  'id.verification.id.tips.title': {
    id: 'id.verification.id.tips.title',
    defaultMessage: 'Helpful Identification Card Tips',
    description: 'Title for the ID Tips page.',
  },
  'id.verification.id.tips.description': {
    id: 'id.verification.id.tips.description',
    defaultMessage: 'Next, we\'ll need you to take a photo of a valid identification card that includes your full name and photo, such as a driver’s license or passport. Please have your ID ready.',
    description: 'Description for the ID Tips page.',
  },
  'id.verification.id.tips.list.well.lit': {
    id: 'id.verification.id.tips.list.well.lit',
    defaultMessage: 'Your identification card is well-lit.',
    description: 'Tip to ensure ID is well lit.',
  },
  'id.verification.id.tips.list.clear': {
    id: 'id.verification.id.tips.list.clear',
    defaultMessage: 'Ensure that you can see your photo and clearly read your name.',
    description: 'Tip to ensure ID and name can be seen clearly.',
  },
  'id.verification.id.photo.title.camera': {
    id: 'id.verification.id.photo.title.camera',
    defaultMessage: 'Take a Photo of Your Identification Card',
    description: 'Title for the ID Photo page if camera access is enabled.',
  },
  'id.verification.id.photo.title.upload': {
    id: 'id.verification.id.photo.title.upload',
    defaultMessage: 'Upload a Photo of Your Identification Card',
    description: 'Title for the ID Photo page if camera access is disabled.',
  },
  'id.verification.id.photo.preview.alt': {
    id: 'id.verification.id.photo.preview.alt',
    defaultMessage: 'Preview of photo ID.',
    description: 'Alt text for the ID photo preview.',
  },
  'id.verification.id.photo.instructions.camera': {
    id: 'id.verification.id.photo.instructions.camera',
    defaultMessage: 'When your ID is in position, use the Take Photo button below to take your photo. Please use a passport, driver’s license, or another identification card that includes your full name and a picture of your face.',
    description: 'Instructions to use the camera to take an ID photo.',
  },
  'id.verification.id.photo.instructions.upload': {
    id: 'id.verification.id.photo.instructions.upload',
    defaultMessage: 'Please upload a photo of your identification card. Ensure the entire ID fits inside the frame and is well-lit. The file size must be under 10 MB. Supported formats: ',
    description: 'Instructions for ID photo upload.',
  },
  'id.verification.id.photo.instructions.upload.error.invalidFileType': {
    id: 'id.verification.id.photo.instructions.upload.error.invalidFileType',
    defaultMessage: 'The file you have selected is not a supported image type. Please choose from the following formats: ',
    description: 'Error message for file upload that is not a supported image type.',
  },
  'id.verification.id.photo.instructions.upload.error.fileTooLarge': {
    id: 'id.verification.id.photo.instructions.upload.error.fileTooLarge',
    defaultMessage: 'The file you have selected is too large. Please try again with a file less than 10MB.',
    description: 'Error message for file upload that is larger than 10MB.',
  },
  'id.verification.name.check.title': {
    id: 'id.verification.name.check.title',
    defaultMessage: 'Double-Check Your Name',
    description: 'Title for the page where a user double-checks that their name is correct.',
  },
  'id.verification.name.check.instructions': {
    id: 'id.verification.name.check.instructions',
    defaultMessage: 'Does the name below match the name on your photo ID? If not, update the name below to match your photo ID.',
    description: 'Text to instruct the user to check that the name displayed on the page matches what is on their photo ID.',
  },
  'id.verification.name.check.mismatch.information': {
    id: 'id.verification.name.check.mismatch.information',
    defaultMessage: 'If the name below does not match your photo ID, your identity verification will be denied.',
    description: 'Text to inform the user that if the name displayed on the page does not match what is on their photo ID, identity verification will be denied.',
  },
  'id.verification.name.error': {
    id: 'id.verification.name.error',
    defaultMessage: 'Please enter your name as it appears on your photo ID.',
    description: 'Error that shows when the user needs to update their name to match the name on their ID.',
  },
  'id.verification.account.name.warning.prefix': {
    id: 'id.verification.account.name.warning.prefix',
    defaultMessage: 'Please Note:',
    description: 'Prefix to the warning that any change to the account name will be saved to the account.',
  },
  'id.verification.account.name.settings': {
    id: 'id.verification.account.name.settings',
    defaultMessage: 'Account Settings',
    description: 'Link to Account Settings.',
  },
  'id.verification.name.label': {
    id: 'id.verification.name.label',
    defaultMessage: 'Name',
    description: 'Label for name input.',
  },
  'id.verification.account.name.photo.alt': {
    id: 'id.verification.account.name.photo.alt',
    defaultMessage: 'Photo of your ID to be submitted.',
    description: 'Alt text for the photo of the user\'s ID.',
  },
  'id.verification.review.title': {
    id: 'id.verification.review.title',
    defaultMessage: 'Review Your Photos',
    description: 'Title for the review your photos page.',
  },
  'id.verification.review.description': {
    id: 'id.verification.review.description',
    defaultMessage: 'Make sure we can verify your identity with the photos and information you have provided.',
    description: 'Description for the review your photos page.',
  },
  'id.verification.review.portrait.label': {
    id: 'id.verification.review.portrait.label',
    defaultMessage: 'Your Portrait',
    description: 'Label for the portrait card.',
  },
  'id.verification.review.portrait.alt': {
    id: 'id.verification.review.portrait.alt',
    defaultMessage: 'Photo of your face to be submitted.',
    description: 'Alt text for the portrait photo.',
  },
  'id.verification.review.portrait.retake': {
    id: 'id.verification.review.portrait.retake',
    defaultMessage: 'Retake Portrait Photo',
    description: 'Button to retake the portrait photo.',
  },
  'id.verification.review.id.label': {
    id: 'id.verification.review.id.label',
    defaultMessage: 'Your Identification Card',
    description: 'Label for the Photo ID card.',
  },
  'id.verification.review.id.alt': {
    id: 'id.verification.review.id.alt',
    defaultMessage: 'Photo of your identification card to be submitted.',
    description: 'Alt text for the ID photo.',
  },
  'id.verification.review.id.retake': {
    id: 'id.verification.review.id.retake',
    defaultMessage: 'Retake ID Photo',
    description: 'Button to retake the ID photo.',
  },
  'id.verification.review.confirm': {
    id: 'id.verification.review.confirm',
    defaultMessage: 'Submit',
    description: 'Button to confirm all information is correct and submit.',
  },
  'id.verification.submission.alert.error.face': {
    id: 'id.verification.submission.alert.error.face',
    defaultMessage: 'A photo of your face is required. Please retake your portrait photo.',
    description: 'Error message displayed when the user\'s portrait photo is missing.',
  },
  'id.verification.submission.alert.error.id': {
    id: 'id.verification.submission.alert.error.id',
    defaultMessage: 'A photo of your ID card is required. Please retake your ID photo.',
    description: 'Error message displayed when the user\'s ID photo is missing.',
  },
  'id.verification.submission.alert.error.name': {
    id: 'id.verification.submission.alert.error.name',
    defaultMessage: 'A valid account name is required. Please update your account name to match the name on your ID.',
    description: 'Error message displayed when the user\'s account name is missing.',
  },
  'id.verification.submission.alert.error.unsupported': {
    id: 'id.verification.submission.alert.error.unsupported',
    defaultMessage: 'One or more of the files you have uploaded is in an unsupported format. Please choose from the following: ',
    description: 'Error message displayed when the user uploads an unsupported file type.',
  },
  'id.verification.review.error': {
    id: 'id.verification.review.error',
    defaultMessage: '{siteName} Support Page',
    description: 'Text linking to the platform support page.',
  },
  'id.verification.submitted.title': {
    id: 'id.verification.submitted.title',
    defaultMessage: 'Identity Verification in Progress',
    description: 'Title for the submitted page.',
  },
  'id.verification.submitted.text': {
    id: 'id.verification.submitted.text',
    defaultMessage: 'We have received your information and are verifying your identity. You will be notified when the verification process is complete (usually within 5 days). In the meantime, you can still access all available course content.',
    description: 'Text confirming that ID verification request has been received.',
  },
  'id.verification.return.dashboard': {
    id: 'id.verification.return.dashboard',
    defaultMessage: 'Return to Your Dashboard',
    description: 'Button to return to the dashboard.',
  },
  'id.verification.return.course': {
    id: 'id.verification.return.course',
    defaultMessage: 'Return to Course',
    description: 'Return to the course which ID verification was accessed from.',
  },
  'id.verification.return.generic': {
    id: 'id.verification.return.generic',
    defaultMessage: 'Return',
    description: 'Button to return to the user\'s original location.',
  },
  'id.verification.photo.upload.help.title': {
    id: 'id.verification.photo.upload.help.title',
    defaultMessage: 'Upload a Photo Instead',
    description: 'Title for section that allows switching to photo upload mode.',
  },
  'id.verification.photo.camera.help.title': {
    id: 'id.verification.photo.camera.help.title',
    defaultMessage: 'Use Your Camera Instead',
    description: 'Title for section that allows switching to camera mode.',
  },
  'id.verification.photo.upload.help.text': {
    id: 'id.verification.photo.upload.help.text',
    defaultMessage: 'If you are having trouble using the photo capture above, you may want to upload a photo instead. To upload a photo, click the button below.',
    description: 'Help text for switching to upload mode.',
  },
  'id.verification.photo.camera.help.text': {
    id: 'id.verification.photo.camera.help.text',
    defaultMessage: 'If you are having trouble uploading a photo above, you may want to use your camera instead. To use your camera, click the button below.',
    description: 'Help text for switching to camera mode.',
  },
  'id.verification.photo.upload.help.button': {
    id: 'id.verification.upload.help.button',
    defaultMessage: 'Switch to Upload Mode',
    description: 'Button used to switch to upload mode.',
  },
  'id.verification.photo.camera.help.button': {
    id: 'id.verification.camera.help.button',
    defaultMessage: 'Switch to Camera Mode',
    description: 'Button used to switch to camera mode.',
  },
});

export default messages;
