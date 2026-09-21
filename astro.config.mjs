// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://zittechlab.com',
	base: '/',
	integrations: [
		starlight({
			title: 'HyperLis Docs',
			description: 'Tài liệu hướng dẫn kỹ thuật và tối ưu hóa hệ thống với HyperLis',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Tiếng Việt',
					lang: 'vi',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			logo: {
				src: './src/assets/logo.png',
			},
			favicon: '/favicon.png',
			social: {
				github: 'https://github.com/ZitTechLab/HyperLis',
				facebook: 'https://www.facebook.com/ZitTechLab/',
			},
			lastUpdated: true,
			components: {
				ThemeSelect: './src/components/ThemeToggle.astro',
				SocialIcons: './src/components/SocialIcons.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				LanguageSelect: './src/components/LanguageSelect.astro',
			},
			head: [
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', href: '/favicon.png' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
				{ tag: 'script', attrs: { src: '/uwu.js', defer: true } },
			],
			customCss: [
				'@fontsource/inter/400.css',
				'@fontsource/inter/500.css',
				'@fontsource/inter/600.css',
				'@fontsource/inter/700.css',
				'./src/styles/custom.css',
			],
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 4,
			},
			sidebar: [
				{
					label: 'Bắt đầu',
					items: [
						{ label: 'Tổng quan về HyperLis', slug: 'getting-started/overview' },
						{ label: 'Tải & cài đặt HyperLis', slug: 'getting-started/installation' },
						{ label: 'Lưu ý sử dụng HyperLis', slug: 'getting-started/safety-policy' },
						{ label: 'Câu hỏi thường gặp (FAQ)', slug: 'getting-started/faq' },
						{ label: 'Về HyperLis & Tác giả', slug: 'getting-started/about-hyperlis' },
						// { label: 'Kích hoạt & Ủng hộ (Donate)', slug: 'getting-started/activation-donation' },
						{ label: 'Cài đặt ngôn ngữ', slug: 'getting-started/language' },
						{ label: 'Nhật ký thay đổi (Changelog)', slug: 'getting-started/changelog' },
					],
				},
				{
					label: 'Dashboard',
					items: [
						{ label: 'Giao diện Dashboard', slug: 'dashboard/dashboard' },
					],
				},
				{
					label: 'Chung',
					items: [
						{ label: 'Hệ thống', slug: 'general/system' },
						{ label: 'Ứng dụng', slug: 'general/apps' },
						{ label: 'Quyền riêng tư', slug: 'general/privacy' },
						{ label: 'Ổ đĩa', slug: 'general/disk-drives' },
					],
				},
				{
					label: 'Windows',
					items: [
						{ label: 'Hệ thống', slug: 'windows/system' },
						{ label: 'Quyền riêng tư', slug: 'windows/privacy' },
						{ label: 'Chơi game', slug: 'windows/gaming' },
						{ label: 'Chế độ nguồn', slug: 'windows/power-plan' },
						{ label: 'Cập nhật Windows (Windows Update)', slug: 'windows/windows-update' },
						{ label: 'Thanh tác vụ', slug: 'windows/taskbar' },
						{ label: 'Quản lý AI trên trình duyệt', slug: 'windows/browser-ai' },
						{ label: 'Mở rộng', slug: 'windows/extras' },
						{ label: 'Tinh chỉnh nâng cao', slug: 'windows/advanced-tweaking' },
					],
				},
				{
					label: 'Ứng dụng UWP',
					items: [
						{ label: 'Ứng dụng UWP', slug: 'uwp-apps/uwp-apps' },
					],
				},
				{
					label: 'Khởi chạy',
					items: [
						{ label: 'Khởi chạy', slug: 'startup-apps/startup-apps' },
					],
				},
				{
					label: 'Tải xuống',
					items: [
						{ label: 'Tải xuống', slug: 'download/download' },
					],
				},
				{
					label: 'Dọn dẹp',
					items: [
						{ label: 'Dọn dẹp', slug: 'cleaning/cleaning' },
					],
				},
				{
					label: 'Mạng',
					items: [
						{ label: 'Thông tin card mạng (NIC)', slug: 'network/network-information' },
						{ label: 'Đổi DNS & Quản lý DNS', slug: 'network/dns-management' },
						{ label: 'Tối ưu hóa mạng', slug: 'network/network-optimization' },
						{ label: 'Kiểm tra Ping & Độ trễ', slug: 'network/ping-tool' },
					],
				},
				{
					label: 'USB Boot',
					items: [
						{ label: 'USB Boot', slug: 'usb-boot/usb-boot' },
					],
				},
				{
					label: 'Phần cứng',
					items: [
						{ label: 'Phần cứng', slug: 'hardware-info/hardware-info' },
					],
				},
				{
					label: 'Quản lý bản quyền',
					items: [
						{ label: 'Quản lý bản quyền', slug: 'manage-license/manage-license' },
					],
				},
				{
					label: 'Đổi phiên bản',
					items: [
						{ label: 'Đổi phiên bản Windows', slug: 'convert-skus/convert-skus' },
					],
				},
				{
					label: 'Cài đặt Office',
					items: [
						{ label: 'Cài đặt Microsoft Office', slug: 'office-setup/office-setup' },
					],
				},
				{
					label: 'Tính năng khác',
					items: [
						{ label: 'Tính năng khác', slug: 'extend-features/extend-features' },
					],
				},
				{
					label: 'WSAP',
					items: [
						{ label: 'Cài đặt Windows tự động (WSAP)', slug: 'wsap/wsap' },
					],
				},
				{
					label: 'Sửa lỗi',
					items: [
						{ label: 'Sửa lỗi máy in', slug: 'errors/printer-errors' },
						{ label: 'Sửa lỗi Windows', slug: 'errors/windows-errors' },
					],
				},
				{
					label: 'Cài đặt',
					items: [
						{ label: 'Cài đặt', slug: 'settings/settings' },
					],
				},
			],
		}),
	],
});
